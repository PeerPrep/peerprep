import { getUnixTimestamp } from 'utils';
import { getRoomState as getRoomStateFromRoomId, removeRoom, setRoomState } from '../models/innkeeper';
import { NotificationMessage } from '../types';
import { PartialRoomState, RoomIoNamespace, RoomIoSocket, RoomOtherSockets, RoomState } from '../types/room';

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
  const { questionId, textEditor, userStates }: RoomState = getRoomState(socket);
  const { userId, roomId } = socket.data;

  const userState = userStates.find(s => s.userId === userId);
  const otherUserState = userStates.find(s => s.userId !== userId);

  userState.status = 'ACTIVE';
  userState.lastSeen = getUnixTimestamp();

  const newRoomState: RoomState = {
    roomId,
    questionId,
    textEditor,
    userStates: [userState, otherUserState],
  };

  setRoomState(roomId, newRoomState);
  socket.emit('sendCompleteRoomState', newRoomState);
  ioRoom
    .in(roomId)
    .fetchSockets()
    .then(sockets =>
      sockets
        .filter(s => s.id !== socket.id)
        .forEach((s: RoomOtherSockets) => {
          s.emit('sendPartialRoomState', { userStates: newRoomState.userStates });
          sendNotification(s, { type: 'SUCCESS', message: 'Your partner has joined.' });
        }),
    );
};

export const handleSendUpdate = (ioRoom: RoomIoNamespace, socket: RoomIoSocket, update: PartialRoomState): void => {
  const roomState: RoomState = getRoomState(socket);
  const { roomId, questionId, textEditor } = roomState;

  const userState = roomState.userStates.find(s => s.userId === socket.data.userId);
  const otherUserState = roomState.userStates.find(s => s.userId !== socket.data.userId);
  userState.lastSeen = getUnixTimestamp();

  const newRoomState: RoomState = {
    roomId,
    questionId: update.questionId ?? questionId,
    textEditor: update.textEditor ?? textEditor,
    userStates: [userState, otherUserState], // userState cannot be edited by user.
  };

  setRoomState(roomId, newRoomState);
  ioRoom
    .in(roomState.roomId)
    .fetchSockets()
    .then(sockets =>
      sockets
        .filter(s => s.id !== socket.id)
        .forEach((s: RoomOtherSockets) => {
          s.emit('sendPartialRoomState', update);
        }),
    );
};

export const handleRequestCompleteState = (ioRoom: RoomIoNamespace, socket: RoomIoSocket): void => {
  socket.emit('sendCompleteRoomState', getRoomState(socket));
};

export const handleLeaveRoom = (ioRoom: RoomIoNamespace, socket: RoomIoSocket): void => {
  const { questionId, textEditor, userStates }: RoomState = getRoomState(socket);
  const { userId, roomId } = socket.data;

  const userState = userStates.find(s => s.userId === userId);
  const otherUserState = userStates.find(s => s.userId !== userId);

  userState.status = 'EXITED';
  userState.lastSeen = getUnixTimestamp();
  const newRoomState: RoomState = {
    roomId,
    questionId,
    textEditor,
    userStates: [userState, otherUserState],
  };

  removeRoom(roomId);
  ioRoom.in(roomId).emit('closeRoom', newRoomState);
};

export const handleDisconnect = (ioRoom: RoomIoNamespace, socket: RoomIoSocket): void => {
  const { questionId, textEditor, userStates }: RoomState = getRoomState(socket);
  const { userId, roomId } = socket.data;

  const userState = userStates.find(s => s.userId === userId);
  const otherUserState = userStates.find(s => s.userId !== userId);

  userState.status = 'INACTIVE';
  userState.lastSeen = getUnixTimestamp();
  const newRoomState: RoomState = {
    roomId,
    questionId,
    textEditor,
    userStates: [userState, otherUserState],
  };

  ioRoom.in(roomId).emit('closeRoom', newRoomState); // Notify both users that one has exited.
  removeRoom(roomId);
};
