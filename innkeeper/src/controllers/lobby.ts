import { sendNotification } from '../controllers';
import { InnState } from '../models';
import { InnkeeperIoServer, InnkeeperIoSocket, MatchingParameters } from '../types';
import { getUnixTimestamp } from '../utils';
import { joinAssignedRoom } from './room';

const notifyOnQueue = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): void => {
  sendNotification(socket, { type: 'INFO', message: 'Added to queue.' });
  const waitingUsers = inn.getWaitingUsers();

  io.fetchSockets().then(otherSockets => {
    for (const otherSocket of otherSockets) {
      if (otherSocket.data.userId === socket.data.userId) {
        continue;
      }

      otherSocket.emit('availableMatches', waitingUsers);
      return;
    }
  });
};

export const handleConnect = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): void => {
  console.log(`User ${socket.data?.userId} connected to lobby.`);
  const waitingUsers = inn.getWaitingUsers();
  socket.emit('availableMatches', waitingUsers);
};

export const handleMatchingRequest = (
  io: InnkeeperIoServer,
  inn: InnState,
  socket: InnkeeperIoSocket,
  params: MatchingParameters,
): void => {
  socket.data.lastMessage = getUnixTimestamp();
  const { userId } = socket.data;

  console.log(`User ${userId} requested a match with parameters ${JSON.stringify(params)}.`);

  // Remove user from queue in case this is a re-request.
  inn.removeUserFromQueue(userId);

  const maybeMatch = inn.queueUserOrReturnMatchResult(userId, params);
  if (!maybeMatch) {
    notifyOnQueue(io, inn, socket);
    console.log(`User ${userId} added to queue.`);
    return;
  }

  const [otherUserId, roomState] = maybeMatch;
  console.log(`Matched users ${userId} and ${otherUserId} in room ${roomState.roomId}.`);

  io.fetchSockets().then(otherSockets => {
    for (const otherSocket of otherSockets) {
      if (otherSocket.data.userId !== otherUserId) {
        continue;
      }

      socket.emit('sendToRoom', roomState.roomId);
      joinAssignedRoom(io, inn, socket);
      otherSocket.emit('sendToRoom', roomState.roomId);
      joinAssignedRoom(io, inn, otherSocket);

      console.log(`Sent users ${userId} and ${otherUserId} to room ${roomState.roomId}.`);
      return;
    }

    // socket with matching otherUserId could not be found, remove from queue.
    console.error(`Could not find socket for userId ${otherUserId} (returned from Redis queue).`);
    inn.removeUserFromQueue(otherUserId);

    inn.addUserToQueue(userId, params);
    notifyOnQueue(io, inn, socket);
  });
};

export const handleDisconnect = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): void => {
  const { userId } = socket.data;
  inn.removeUserFromQueue(userId);

  console.log(`User ${userId} disconnected from lobby.`);
};
