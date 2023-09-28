import { sendNotification } from '../controllers';
import { joinAssignedRoom } from '../controllers/room';
import { getRoomId } from '../models/room';
import { InnkeeperIoServer, InnkeeperIoSocket, NotificationMessage } from '../types';

export const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

const requireUser = (io: InnkeeperIoServer, socket: InnkeeperIoSocket): boolean => {
  // Refer to: https://socket.io/docs/v4/middlewares/#sending-credentials

  // TODO: Implement real auth. Skipping auth and reading from header for easier testing with postman.
  const userId = socket.handshake.headers.trustmefr as string;

  if (!userId) {
    const err = new Error('Authorization error');
    const authFailureMessage: NotificationMessage = { type: 'ERROR', message: 'Authorization failed.' };
    socket.emit('sendNotification', authFailureMessage);
    socket.disconnect(true);
    return false;
  }

  socket.data.userId = userId;
  socket.data.roomId = getRoomId(userId);
  socket.data.lastMessage = getUnixTimestamp();
  return true;
};

export const requireMatchedUser = (io: InnkeeperIoServer, socket: InnkeeperIoSocket): boolean => {
  if (!requireUser(io, socket)) return false;

  if (socket.data.roomId) {
    sendNotification(socket, { type: 'ERROR', message: 'User has not been matched.' });
    return false;
  }

  joinAssignedRoom(io, socket);
  return true;
};

export const requireUnmatchedUser = (io: InnkeeperIoServer, socket: InnkeeperIoSocket): boolean => {
  if (!requireUser(io, socket)) return false;

  if (socket.data.roomId) {
    sendNotification(socket, { type: 'ERROR', message: 'User has been matched already.' });
    return false;
  }

  return true;
};
