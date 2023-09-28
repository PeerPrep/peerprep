import { sendNotification } from '../controllers';
import { addUserToQueue, getWaitingUsers, queueUserOrReturnMatchResult, removeUserFromQueue } from '../models/users';
import { InnkeeperIoServer, InnkeeperIoSocket, InnkeeperOtherSockets, MatchingParameters, WaitingUsersCount } from '../types';
import { getUnixTimestamp } from '../utils';
import { joinAssignedRoom } from './room';

const sendAvailableMatches = (socket: InnkeeperIoSocket | InnkeeperOtherSockets, availableMatches: WaitingUsersCount): void => {
  socket.emit('availableMatches', availableMatches);
};

const notifyOnQueue = (io: InnkeeperIoServer, socket: InnkeeperIoSocket): void => {
  sendNotification(socket, { type: 'INFO', message: 'Added to queue.' });
  const waitingUsers = getWaitingUsers();

  io.fetchSockets().then(otherSockets => {
    for (const otherSocket of otherSockets) {
      if (otherSocket.data.userId === socket.data.userId) {
        continue;
      }

      sendAvailableMatches(otherSocket, waitingUsers);
      return;
    }
  });
};

export const handleConnect = (io: InnkeeperIoServer, socket: InnkeeperIoSocket): void => {
  const waitingUsers = getWaitingUsers();
  sendAvailableMatches(socket, waitingUsers);
};

export const handleMatchingRequest = (io: InnkeeperIoServer, socket: InnkeeperIoSocket, params: MatchingParameters): void => {
  socket.data.lastMessage = getUnixTimestamp();

  const { userId } = socket.data;

  // Remove user from queue in case this is a re-request.
  removeUserFromQueue(userId);

  const maybeMatch = queueUserOrReturnMatchResult(userId, params);
  if (!maybeMatch) {
    notifyOnQueue(io, socket);
    return;
  }

  const [otherUserId, roomState] = maybeMatch;
  io.fetchSockets().then(otherSockets => {
    for (const otherSocket of otherSockets) {
      if (otherSocket.data.userId !== otherUserId) {
        continue;
      }

      socket.emit('sendToRoom', roomState.roomId);
      joinAssignedRoom(io, socket);
      otherSocket.emit('sendToRoom', roomState.roomId);
      joinAssignedRoom(io, otherSocket);
      return;
    }

    // socket with matching otherUserId could not be found, remove from queue.
    console.error(`Could not find socket for userId ${otherUserId} (returned from Redis queue).`);
    removeUserFromQueue(otherUserId);

    addUserToQueue(userId, params);
    notifyOnQueue(io, socket);
  });
};

export const handleDisconnect = (io: InnkeeperIoServer, socket: InnkeeperIoSocket): void => {
  const { userId } = socket.data;
  removeUserFromQueue(userId);
};
