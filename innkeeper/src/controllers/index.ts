import { InnkeeperIoSocket, InnkeeperOtherSockets, NotificationMessage } from '../types';
import { SHOULD_LOG } from '../utils';

export const sendNotification = (socket: InnkeeperIoSocket | InnkeeperOtherSockets, { type, message }: NotificationMessage) => {
  const socketData = `${socket.id} (userId: ${socket.data.userId})`;
  SHOULD_LOG && console.log(`[OTHER][NOTIF] Sending ${type} notification to ${socketData}: ${message}`);
  socket.emit('sendNotification', { type, message });
};
