import { addUserToQueue, getWaitingUsers, queueUserOrReturnMatchResult, removeUserFromQueue } from '../models/innkeeper';
import { NotificationMessage } from '../types';
import { InnkeeperIoServer, InnkeeperIoSocket, InnkeeperOtherSockets, MatchingParameters, WaitingUsersCount } from '../types/lobby';
import { getUnixTimestamp } from '../utils';

export const sendNotification = (socket: InnkeeperIoSocket | InnkeeperOtherSockets, { type, message }: NotificationMessage) => {
  const socketData = `${socket.id} (userId: ${socket.data.userId})`;
  console.log(`Sending ${type} notification to ${socketData}: ${message}`);
  socket.emit('sendNotification', { type, message });
};

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

  const match = queueUserOrReturnMatchResult(userId, params);
  if (!match) {
    notifyOnQueue(io, socket);
    return;
  }

  const { roomId, otherUserId } = match;
  const notification: NotificationMessage = { type: 'SUCCESS', message: 'Found a match!' };
  io.fetchSockets().then(otherSockets => {
    for (const otherSocket of otherSockets) {
      if (otherSocket.data.userId !== otherUserId) {
        continue;
      }

      socket.emit('sendToRoom', { roomId, userIds: [userId, otherUserId], notification });
      otherSocket.emit('sendToRoom', { roomId, userIds: [userId, otherUserId], notification });
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
