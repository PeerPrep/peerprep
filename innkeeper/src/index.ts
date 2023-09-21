import { Server } from 'socket.io';
import {
  handleConnect as handleLobbyConnect,
  handleDisconnect as handleLobbyDisconnect,
  handleMatchingRequest,
  sendNotification as sendLobbyNotification,
} from './controllers/lobby';
import {
  handleLeaveRoom,
  handleRequestCompleteState,
  handleConnect as handleRoomConnect,
  handleDisconnect as handleRoomDisconnect,
  handleSendUpdate,
  sendNotification as sendRoomNotification,
} from './controllers/room';
import { InnkeeperIoServer, InnkeeperIoSocket } from './types/lobby';
import { RoomIoNamespace, RoomIoSocket } from './types/room';
import { setRoomIdIfPresent, validateUserToken } from './utils';

const io: InnkeeperIoServer = new Server(4100, {
  path: '/api/v1/innkeeper/',
});

io.use(validateUserToken); // Validates JWT token and sets socket.data.userId.
io.use(setRoomIdIfPresent); // Sets socket.data.roomId if user has an existing Room ID.

// Register lobby.
io.on('connection', (socket: InnkeeperIoSocket) => {
  if (socket.data.roomId) {
    sendLobbyNotification(socket, { type: 'ERROR', message: 'User already has a room, switch to namespace /room.' });
    return;
  }

  handleLobbyConnect(io, socket);

  socket.on('makeMatchingRequest', params => handleMatchingRequest(io, socket, params));
  socket.on('disconnect', () => handleLobbyDisconnect(io, socket));
});

// Register room namespace.
const ioRoom: RoomIoNamespace = io.of('/room');

ioRoom.use(validateUserToken); // Validates JWT token and sets socket.data.userId.
ioRoom.use(setRoomIdIfPresent); // Sets socket.data.roomId if user has an existing Room ID.

ioRoom.on('connection', (socket: RoomIoSocket) => {
  const { roomId } = socket.data;
  if (!roomId) {
    sendRoomNotification(socket, { type: 'ERROR', message: 'User has not been assigned a room.' });
    return;
  }

  socket.join(roomId);

  handleRoomConnect(ioRoom, socket);

  socket.on('sendUpdate', update => handleSendUpdate(ioRoom, socket, update));
  socket.on('requestCompleteRoomState', () => handleRequestCompleteState(ioRoom, socket));
  socket.on('leaveRoom', () => handleLeaveRoom(ioRoom, socket));
  socket.on('disconnect', () => handleRoomDisconnect(ioRoom, socket));
});
