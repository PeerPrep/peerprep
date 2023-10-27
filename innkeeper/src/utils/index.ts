import { Auth } from 'firebase-admin/auth';
import { sendNotification } from '../controllers';
import { joinAssignedRoom } from '../controllers/room';
import { InnState } from '../models';
import { InnkeeperIoServer, InnkeeperIoSocket, NotificationMessage } from '../types';

export const SHOULD_LOG = process.env.LOGGING === 'VERBOSE';

export const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const requireUser = async (
  firebaseAuth: Auth,
  inn: InnState,
  socket: InnkeeperIoSocket,
  next: (maybeError?: any | undefined) => void,
): Promise<void> => {
  let userId: string | undefined = undefined;
  try {
    const authToken = socket.handshake.auth.token;
    userId = (await firebaseAuth.verifyIdToken(authToken)).uid;
  } catch (error) {
    // Leave userId unset.
  }

  if (!userId) {
    const authFailureMessage: NotificationMessage = { type: 'ERROR', message: 'Authorization failed.' };
    socket.emit('sendNotification', authFailureMessage);
    socket.disconnect(true);
    return next(new Error('Authorization failed.'));
  }

  socket.data.userId = userId;
  socket.data.displayName = (await firebaseAuth.getUser(userId)).displayName ?? 'Anonymous';
  socket.data.roomId = inn.getRoomId(userId);
  socket.data.lastMessage = getUnixTimestamp();

  SHOULD_LOG && console.log(`User ${userId} connected, with room ${socket.data.roomId}.`);
  return next();
};

export const requireMatchedUser = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): boolean => {
  if (!socket.data.roomId) {
    sendNotification(socket, { type: 'ERROR', message: 'User has not been matched.' });
    return false;
  }

  joinAssignedRoom(io, inn, socket);
  return true;
};

export const requireUnmatchedUser = (socket: InnkeeperIoSocket): boolean => {
  if (socket.data.roomId) {
    sendNotification(socket, { type: 'ERROR', message: 'User has been matched already.' });
    return false;
  }

  return true;
};
