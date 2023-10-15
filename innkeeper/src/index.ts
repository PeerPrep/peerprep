import { Server } from 'socket.io';
import { Document, YSocketIO } from 'y-socket.io/dist/server';
import { handleConnect as handleLobbyConnect, handleDisconnect as handleLobbyDisconnect, handleMatchingRequest } from './controllers/lobby';
import {
  handleLeaveRoom,
  handleRequestCompleteState,
  handleDisconnect as handleRoomDisconnect,
  handleSendUpdate,
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

  socket.on('sendUpdate', update => requireMatchedUser(io, inn, socket) && handleSendUpdate(io, inn, socket, update));
  socket.on('requestCompleteRoomState', () => requireMatchedUser(io, inn, socket) && handleRequestCompleteState(io, inn, socket));
  socket.on('leaveRoom', () => requireMatchedUser(io, inn, socket) && handleLeaveRoom(io, inn, socket));

  socket.on('disconnect', () =>
    // At the point of disconnect, check if roomId is set.
    socket.data.roomId ? handleRoomDisconnect(io, inn, socket) : handleLobbyDisconnect(io, inn, socket),
  );
});

// Register yjs namespace
const ysocketio = new YSocketIO(io, {
  // authenticate: (auth) => auth.token === 'valid-token',
  // levelPersistenceDir: './storage-location',
  // gcEnabled: true,
});

ysocketio.on('document-loaded', (doc: Document) => console.log(`The document ${doc.name} was loaded`));
ysocketio.on('document-update', (doc: Document, update: Uint8Array) => console.log(`The document ${doc.name} is updated`));
ysocketio.on('awareness-update', (doc: Document, update: Uint8Array) =>
  console.log(`The awareness of the document ${doc.name} is updated`),
);
ysocketio.on('document-destroy', async (doc: Document) => console.log(`The document ${doc.name} is being destroyed`));
ysocketio.on('all-document-connections-closed', async (doc: Document) =>
  console.log(`All clients of document ${doc.name} are disconnected`),
);

// Execute initialize method
ysocketio.initialize();
