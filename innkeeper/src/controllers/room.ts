import { getRoomState as getRoomStateFromRoomId } from '../models/innkeeper';
import { NotificationMessage } from '../types';
import { RoomIoNamespace, RoomIoSocket, RoomOtherSockets, RoomState } from '../types/room';

export const sendNotification = (socket: RoomIoSocket | RoomOtherSockets, { type, message }: NotificationMessage): void => {
  const socketData = `${socket.id} (userId: ${socket.data.userId}, room: ${socket.data.roomId})`;
  console.log(`Sending ${type} notification to ${socketData}: ${message}`);
  socket.emit('sendNotification', { type, message });
};

export const getRoomState = (socket: RoomIoSocket): RoomState => {
  const { roomId } = socket.data;
  return getRoomStateFromRoomId(roomId);
};

/** Ensure new roommate and existing roommate have the same state. */
export const handleConnect = (ioRoom: RoomIoNamespace, socket: RoomIoSocket): void => {
  const roomState: RoomState = getRoomState(socket);

  socket.emit('sendCompleteRoomState', roomState);
  ioRoom
    .in(roomState.roomId)
    .fetchSockets()
    .then(sockets =>
      sockets
        .filter(s => s.id !== socket.id)
        .forEach((s: RoomOtherSockets) => {
          s.emit('sendPartialRoomState', { userStates: roomState.userStates });
          sendNotification(s, { type: 'SUCCESS', message: 'Your partner has joined.' });
        }),
    );
};

export const handleRequestCompleteState = (ioRoom: RoomIoNamespace, socket: RoomIoSocket): void => {};
export const handleLeaveRoom = (ioRoom: RoomIoNamespace, socket: RoomIoSocket): void => {};
export const handleDisconnect = (ioRoom: RoomIoNamespace, socket: RoomIoSocket): void => {};
