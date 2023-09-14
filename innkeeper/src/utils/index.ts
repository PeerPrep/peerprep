import { getRoomId } from '../models/innkeeper';
import { NotificationMessage } from '../types';
import { InnkeeperIoSocket } from '../types/lobby';

export const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const validateUserToken = (socket: InnkeeperIoSocket, next: any) => {
  // Refer to: https://socket.io/docs/v4/middlewares/#sending-credentials
  const jwtToken = socket.handshake.auth.token;

  // TODO: authentication.
  const passed = true;

  if (!passed) {
    const err = new Error('Authorization error');
    const authFailureMessage: NotificationMessage = { type: 'ERROR', message: 'Authorization failed.' };
    (err as any).data = authFailureMessage; // additional details
    next(err); // Sockets.IO will handle this error and close the connection.
  }

  socket.data.userId = '123abc';
  socket.data.lastMessage = getUnixTimestamp();
  next();
};

export const setRoomIdIfPresent = (socket: InnkeeperIoSocket, next: any) => {
  const { userId } = socket.data;
  socket.data.roomId = getRoomId(userId);
  next();
};
