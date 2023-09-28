import { InnkeeperIoServer, InnkeeperIoSocket, InnkeeperOtherSockets, NotificationMessage } from '../types';
import { joinAssignedRoom } from './room';

export const sendNotification = (socket: InnkeeperIoSocket | InnkeeperOtherSockets, { type, message }: NotificationMessage) => {
  const socketData = `${socket.id} (userId: ${socket.data.userId})`;
  console.log(`Sending ${type} notification to ${socketData}: ${message}`);
  socket.emit('sendNotification', { type, message });
};
