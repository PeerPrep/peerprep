import { sendNotification } from '../controllers';
import { InnState } from '../models';
import { InnkeeperIoServer, InnkeeperIoSocket, InnkeeperOtherSockets, PartialRoomState, RoomState, UserState } from '../types';
import { getUnixTimestamp } from '../utils';

export const getRoomState = (inn: InnState, socket: InnkeeperIoSocket | InnkeeperOtherSockets): RoomState | undefined => {
  const { roomId } = socket.data;
  if (!roomId) {
    console.error(`[ROOM][ERR] Unexpected undefined roomId for socket ${socket.id}. Data: ${socket.data}.`);
    return undefined;
  }

  const roomState = inn.getRoomState(roomId);
  if (!roomState) {
    console.error(`[ROOM][ERR] Unexpected undefined roomState for socket ${socket.id}. Data: ${socket.data}.`);
    return undefined;
  }

  return roomState;
};

const getSelfAndOtherUser = (room: RoomState, userId: string): [UserState, UserState] | undefined => {
  const { userStates } = room;
  const userState = userStates.find(s => s.userId === userId);
  const otherUserState = userStates.find(s => s.userId !== userId);
  if (!userState || !otherUserState) {
    console.error(`[ROOM][ERR] Unexpected user states in ${room.roomId}: ${userStates} (asking for ${userId} & roommate).`);
    return undefined;
  }

  return [userState, otherUserState];
};

/** Ensure new roommate and existing roommate have the same state. */
export const joinAssignedRoom = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket | InnkeeperOtherSockets): void => {
  const roomState = getRoomState(inn, socket);
  if (!roomState) {
    sendNotification(socket, { type: 'ERROR', message: 'Room state not found.' });
    return;
  }

  const { roomId, questionId, userStates } = roomState;
  const { userId } = socket.data;

  // If user is already in room, don't join again.
  socket.rooms.has(roomId) || socket.join(roomId);

  const getSelfAndOtherUserResult = getSelfAndOtherUser(roomState, userId);
  if (!getSelfAndOtherUserResult) {
    sendNotification(socket, { type: 'ERROR', message: 'User state not found.' });
    return;
  }

  const [userState, otherUserState] = getSelfAndOtherUserResult;
  const previousUserStatus = userState.status;

  userState.status = 'ACTIVE';
  userState.lastSeen = getUnixTimestamp();

  const newRoomState: RoomState = { ...roomState, roomId, questionId, userStates: [userState, otherUserState] };

  inn.setRoomState(roomId, newRoomState);

  // If continuously active, don't sendPartialRoomState to other user.
  if (previousUserStatus === 'ACTIVE') {
    return;
  }

  // If new / rejoined connection, sendCompleteRoomState to user and sendPartialRoomState to other user.
  socket.emit('sendCompleteRoomState', newRoomState);
  io.in(roomId)
    .fetchSockets()
    .then(sockets =>
      sockets
        .filter(s => s.id !== socket.id)
        .forEach((s: InnkeeperOtherSockets) => {
          s.emit('sendPartialRoomState', { userStates: newRoomState.userStates });
        }),
    );
};

export const handleSendUpdate = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket, update: PartialRoomState): void => {
  const roomState = getRoomState(inn, socket);
  if (!roomState) {
    sendNotification(socket, { type: 'ERROR', message: 'Room state not found.' });
    return;
  }

  const getSelfAndOtherUserResult = getSelfAndOtherUser(roomState, socket.data.userId);
  if (!getSelfAndOtherUserResult) {
    sendNotification(socket, { type: 'ERROR', message: 'User state not found.' });
    return;
  }

  const { roomId, questionId } = roomState;
  const [userState, otherUserState] = getSelfAndOtherUserResult;

  userState.lastSeen = getUnixTimestamp();

  const newRoomState: RoomState = {
    ...roomState,
    roomId,
    questionId: update.questionId ?? questionId,
    userStates: [userState, otherUserState], // userState cannot be edited by user.
  };

  inn.setRoomState(roomId, newRoomState);
  io.in(roomState.roomId)
    .fetchSockets()
    .then(sockets =>
      sockets.forEach((s: InnkeeperOtherSockets) => {
        s.emit('sendPartialRoomState', update);
      }),
    );
};

export const handleRequestCompleteState = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): void => {
  const roomState = getRoomState(inn, socket);
  if (!roomState) {
    sendNotification(socket, { type: 'ERROR', message: 'Room state not found.' });
    return;
  }

  socket.emit('sendCompleteRoomState', roomState);
};

export const handleLeaveRoom = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): void => {
  const roomState = getRoomState(inn, socket);
  if (!roomState) {
    sendNotification(socket, { type: 'ERROR', message: 'Room state not found.' });
    return;
  }

  const getSelfAndOtherUserResult = getSelfAndOtherUser(roomState, socket.data.userId);
  if (!getSelfAndOtherUserResult) {
    sendNotification(socket, { type: 'ERROR', message: 'User state not found.' });
    return;
  }

  const [userState, otherUserState] = getSelfAndOtherUserResult;
  const { questionId, roomId } = roomState;

  userState.status = 'EXITED';
  userState.lastSeen = getUnixTimestamp();
  const newRoomState: RoomState = { ...roomState, roomId, questionId, userStates: [userState, otherUserState] };

  inn.removeRoom(roomId);
  io.in(roomId).emit('closeRoom', newRoomState);
};

export const handleDisconnect = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket): void => {
  const roomState = getRoomState(inn, socket);
  if (!roomState) {
    sendNotification(socket, { type: 'ERROR', message: 'Room state not found.' });
    return;
  }

  const getSelfAndOtherUserResult = getSelfAndOtherUser(roomState, socket.data.userId);
  if (!getSelfAndOtherUserResult) {
    sendNotification(socket, { type: 'ERROR', message: 'User state not found.' });
    return;
  }

  const [userState, otherUserState] = getSelfAndOtherUserResult;
  const { questionId, roomId } = roomState;

  userState.status = 'INACTIVE';
  userState.lastSeen = getUnixTimestamp();
  const newRoomState: RoomState = { ...roomState, roomId, questionId, userStates: [userState, otherUserState] };

  inn.setRoomState(roomId, newRoomState);
  io.in(roomId).emit('sendPartialRoomState', { userStates: [userState, otherUserState] }); // Notify that one user is inactive.
};

export const handleChatMessage = (io: InnkeeperIoServer, inn: InnState, socket: InnkeeperIoSocket, message: string) => {
  const roomState = getRoomState(inn, socket);

  // Ensure the room state exists
  if (!roomState) {
    sendNotification(socket, { type: 'ERROR', message: 'Room state not found.' });
    return;
  }

  // Get the user ID from the socket data
  const userId = socket.data.userId;

  // Create a new chat message object
  const chatMessage = {
    user: userId,
    message: message,
  };

  // Store the chat message in the room's chat history
  if (!roomState.chatHistory) {
    roomState.chatHistory = [];
  }
  roomState.chatHistory.push(chatMessage);

  // Emit the chat message to all users in the room
  io.to(roomState.roomId).emit('sendPartialRoomState', { chatHistory: roomState.chatHistory });
};
