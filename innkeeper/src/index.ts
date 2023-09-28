import { Server } from 'socket.io';
import { handleConnect as handleLobbyConnect, handleDisconnect as handleLobbyDisconnect, handleMatchingRequest } from './controllers/lobby';
import {
  handleLeaveRoom,
  handleRequestCompleteState,
  handleDisconnect as handleRoomDisconnect,
  handleSendUpdate,
  joinAssignedRoom,
} from './controllers/room';
import { InnkeeperIoServer, InnkeeperIoSocket } from './types';
import { requireMatchedUser, requireUnmatchedUser } from './utils';

const io: InnkeeperIoServer = new Server(4100);

// Register lobby.
io.on('connection', (socket: InnkeeperIoSocket) => {
  if (!socket.data.roomId) {
    handleLobbyConnect(io, socket);
  } else {
    // For reconnecting matched users, directly send them to their room.
    joinAssignedRoom(io, socket);
  }

  socket.on('makeMatchingRequest', params => requireUnmatchedUser(io, socket) && handleMatchingRequest(io, socket, params));

  socket.on('sendUpdate', update => requireMatchedUser(io, socket) && handleSendUpdate(io, socket, update));
  socket.on('requestCompleteRoomState', () => requireMatchedUser(io, socket) && handleRequestCompleteState(io, socket));
  socket.on('leaveRoom', () => requireMatchedUser(io, socket) && handleLeaveRoom(io, socket));

  socket.on('disconnect', () =>
    // At the point of disconnect, check if roomId is set.
    socket.data.roomId ? handleRoomDisconnect(io, socket) : handleLobbyDisconnect(io, socket),
  );
});
