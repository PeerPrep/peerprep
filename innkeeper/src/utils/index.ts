import { getRoomId } from '../models/room';
import { NotificationMessage } from '../types';
import { InnkeeperIoSocket } from '../types/lobby';

export const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const validateUserToken = (socket: InnkeeperIoSocket, next: any) => {
  // Refer to: https://socket.io/docs/v4/middlewares/#sending-credentials

  // TODO: Implement real auth. Skipping auth and reading from header for easier testing with postman.
  const userId = socket.handshake.headers.trustmefr as string;

  if (!userId) {
    const err = new Error('Authorization error');
    const authFailureMessage: NotificationMessage = { type: 'ERROR', message: 'Authorization failed.' };
    (err as any).data = authFailureMessage; // additional details
    next(err); // Sockets.IO will handle this error and close the connection.
    return;
  }

  socket.data.userId = userId;
  socket.data.lastMessage = getUnixTimestamp();
  next();
};

export const setRoomIdIfPresent = (socket: InnkeeperIoSocket, next: any) => {
  const { userId } = socket.data;
  socket.data.roomId = getRoomId(userId);
  next();
};
