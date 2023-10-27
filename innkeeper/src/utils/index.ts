import { sendNotification } from '../controllers';
import { joinAssignedRoom } from '../controllers/room';
import { InnState } from '../models';
import { InnkeeperIoServer, InnkeeperIoSocket, NotificationMessage } from '../types';

export const SHOULD_LOG = process.env.LOGGING === 'VERBOSE';

export const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const requireUser = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): boolean => {
  // Refer to: https://socket.io/docs/v4/middlewares/#sending-credentials

  // TODO: Implement real auth. Skipping auth and reading from header for easier testing with postman.
  const userId = socket.handshake.headers.trustmefr as string;

  if (!userId) {
    const authFailureMessage: NotificationMessage = { type: 'ERROR', message: 'Authorization failed.' };
    socket.emit('sendNotification', authFailureMessage);
    socket.disconnect(true);
    return false;
  }

  socket.data.userId = userId;
  socket.data.roomId = inn.getRoomId(userId);
  socket.data.lastMessage = getUnixTimestamp();

  SHOULD_LOG && console.log(`User ${userId} connected, with room ${socket.data.roomId}.`);
  return true;
};

export const requireMatchedUser = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): boolean => {
  if (!requireUser(io, inn, socket)) return false;

  if (!socket.data.roomId) {
    sendNotification(socket, { type: 'ERROR', message: 'User has not been matched.' });
    return false;
  }

  joinAssignedRoom(io, inn, socket);
  return true;
};

export const requireUnmatchedUser = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): boolean => {
  if (!requireUser(io, inn, socket)) return false;

  if (socket.data.roomId) {
    sendNotification(socket, { type: 'ERROR', message: 'User has been matched already.' });
    return false;
  }

  return true;
};
