import { sendNotification } from '../controllers';
import { InnState } from '../models';
import { InnkeeperIoServer, InnkeeperIoSocket, MatchingParameters } from '../types';
import { SHOULD_LOG, getUnixTimestamp } from '../utils';
import { joinAssignedRoom } from './room';

const notifyOnQueue = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): void => {
  sendNotification(socket, { type: 'INFO', message: 'Added to queue.' });
  const waitingUsers = inn.getWaitingUsers();

  io.in('lobby')
    .fetchSockets()
    .then(otherSockets => {
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
  SHOULD_LOG && console.log(`User ${socket.data?.userId} connected to lobby.`);
  const waitingUsers = inn.getWaitingUsers();
  socket.join('lobby');
  socket.emit('availableMatches', waitingUsers);
};

export const handleMatchingRequest = (
  io: InnkeeperIoServer,
  inn: InnState,
  socket: InnkeeperIoSocket,
  params: MatchingParameters,
): void => {
  socket.data.lastMessage = getUnixTimestamp();
  const { userId, displayName } = socket.data;

  SHOULD_LOG && console.log(`User ${displayName} (${userId}) requested a match with parameters ${JSON.stringify(params)}.`);

  // Remove user from queue in case this is a re-request.
  inn.removeUserFromQueue({ userId, displayName });

  const maybeMatch = inn.queueUserOrReturnMatchResult({ userId, displayName }, params);
  if (!maybeMatch) {
    notifyOnQueue(io, inn, socket);
    SHOULD_LOG && console.log(`User ${userId} added to queue.`);
    return;
  }

  const [otherUserId, roomState] = maybeMatch;
  SHOULD_LOG && console.log(`Matched users ${userId} and ${otherUserId} in room ${roomState.roomId}.`);

  io.in('lobby')
    .fetchSockets()
    .then(otherSockets => {
      for (const otherSocket of otherSockets) {
        if (otherSocket.data.userId !== otherUserId.userId) {
          continue;
        }

        socket.data.roomId = roomState.roomId;
        socket.emit('sendToRoom', roomState.roomId);
        joinAssignedRoom(io, inn, socket);
        otherSocket.data.roomId = roomState.roomId;
        otherSocket.emit('sendToRoom', roomState.roomId);
        joinAssignedRoom(io, inn, otherSocket);

        SHOULD_LOG && console.log(`Sent users ${userId} and ${otherUserId} to room ${roomState.roomId}.`);
        return;
      }

      // socket with matching otherUserId could not be found, remove from queue.
      console.error(`Could not find socket for userId ${otherUserId} (returned from queue).`);
      inn.removeUserFromQueue(otherUserId);

      inn.addUserToQueue({ userId, displayName }, params);
      notifyOnQueue(io, inn, socket);
    });
};

export const handleDisconnect = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): void => {
  const { userId, displayName } = socket.data;
  inn.removeUserFromQueue({ userId, displayName });

  SHOULD_LOG && console.log(`User ${userId} disconnected from lobby.`);
};
