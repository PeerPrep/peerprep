import { Server } from 'socket.io';
import { handleConnect as handleLobbyConnect, handleDisconnect as handleLobbyDisconnect, handleMatchingRequest } from './controllers/lobby';
import {
  handleLeaveRoom,
  handleRequestCompleteState,
  handleDisconnect as handleRoomDisconnect,
  handleSendUpdate,
  handleSyncDocument,
  joinAssignedRoom,
} from './controllers/room';
import { InnState } from './models';
import { InnkeeperIoServer, InnkeeperIoSocket } from './types';
import { requireMatchedUser, requireUnmatchedUser, requireUser } from './utils';

const io: InnkeeperIoServer = new Server(4100, {
  cors: {
    origin: '*',
  },
  path: '/api/v1/innkeeper',
});
const inn: InnState = new InnState();

// Register lobby.
io.on('connection', (socket: InnkeeperIoSocket) => {
  if (!requireUser(io, inn, socket)) {
    // Sending error already handled in requireUser.
    return;
  }

  if (!socket.data.roomId) {
    handleLobbyConnect(io, inn, socket);
  } else {
    // For reconnecting matched users, directly send them to their room.
    joinAssignedRoom(io, inn, socket);
  }

  socket.on('makeMatchingRequest', params => requireUnmatchedUser(io, inn, socket) && handleMatchingRequest(io, inn, socket, params));

  socket.on('sendRoomUpdate', update => requireMatchedUser(io, inn, socket) && handleSendUpdate(io, inn, socket, update));
  socket.on(
    'syncDocument',
    (version, localChanges) => requireMatchedUser(io, inn, socket) && handleSyncDocument(io, inn, socket, version, localChanges),
  );

  socket.on('requestCompleteRoomState', () => requireMatchedUser(io, inn, socket) && handleRequestCompleteState(io, inn, socket));
  socket.on('leaveRoom', () => requireMatchedUser(io, inn, socket) && handleLeaveRoom(io, inn, socket));

  socket.on('disconnect', () =>
    // At the point of disconnect, check if roomId is set.
    socket.data.roomId ? handleRoomDisconnect(io, inn, socket) : handleLobbyDisconnect(io, inn, socket),
  );
});
