import 'dotenv/config';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Server } from 'socket.io';
import { handleConnect as handleLobbyConnect, handleDisconnect as handleLobbyDisconnect, handleMatchingRequest } from './controllers/lobby';
import {
  handleChatMessage,
  handleLeaveRoom,
  handleRequestCompleteState,
  handleDisconnect as handleRoomDisconnect,
  handleSendUpdate,
  joinAssignedRoom,
} from './controllers/room';
import { InnState } from './models';
import { InnkeeperIoServer, InnkeeperIoSocket } from './types';
import { SHOULD_LOG, requireMatchedUser, requireUnmatchedUser, requireUser } from './utils';
const YS = require('y-socket.io/dist/server');

const firebaseApp = initializeApp({
  credential: applicationDefault(),
  storageBucket: process.env.BUCKET_NAME,
});

const firebaseAuth = getAuth(firebaseApp);

const io: InnkeeperIoServer = new Server(4100, {
  cors: {
    origin: '*',
  },
  path: '/api/v1/innkeeper',
});
const inn: InnState = new InnState();

// Register lobby.
io.use((socket: InnkeeperIoSocket, next) => {
  requireUser(firebaseAuth, inn, socket, next);
});

io.on('connection', (socket: InnkeeperIoSocket) => {
  if (!socket.data.roomId) {
    handleLobbyConnect(io, inn, socket);
  } else {
    // For reconnecting matched users, directly send them to their room.
    joinAssignedRoom(io, inn, socket);
  }

  socket.on('makeMatchingRequest', params => requireUnmatchedUser(socket) && handleMatchingRequest(io, inn, socket, params));

  socket.on('sendUpdate', update => requireMatchedUser(io, inn, socket) && handleSendUpdate(io, inn, socket, update));
  socket.on('requestCompleteRoomState', () => requireMatchedUser(io, inn, socket) && handleRequestCompleteState(io, inn, socket));
  socket.on('leaveRoom', () => requireMatchedUser(io, inn, socket) && handleLeaveRoom(io, inn, socket));
  socket.on('sendChatMessage', (message: string) => requireMatchedUser(io, inn, socket) && handleChatMessage(io, inn, socket, message));

  socket.on('leaveQueue', () => handleLobbyDisconnect(io, inn, socket));
  socket.on('disconnect', () =>
    // At the point of disconnect, check if roomId is set.
    socket.data.roomId ? handleRoomDisconnect(io, inn, socket) : handleLobbyDisconnect(io, inn, socket),
  );
});

// Register yjs namespace
const ysocketio = new YS.YSocketIO(io, {
  // authenticate: (auth) => auth.token === 'valid-token',
  // levelPersistenceDir: './storage-location',
  gcEnabled: false,
});

ysocketio.on('document-loaded', (doc: any) => SHOULD_LOG && console.log(`[ROOM][YDOC] The document ${doc.name} was loaded`));
ysocketio.on(
  'document-update',
  (doc: any, update: Uint8Array) => SHOULD_LOG && console.log(`[ROOM][YDOC] The document ${doc.name} is updated`),
);
ysocketio.on('awareness-update', (doc: any, update: Uint8Array) => {
  // SHOULD_LOG && console.log(`The awareness of the document ${doc.name} is updated`),
});
ysocketio.on('document-destroy', async (doc: any) => SHOULD_LOG && console.log(`[ROOM][YDOC] The document ${doc.name} is being destroyed`));
ysocketio.on(
  'all-document-connections-closed',
  async (doc: any) => SHOULD_LOG && console.log(`[ROOM][YDOC] All clients of document ${doc.name} are disconnected`),
);

// Execute initialize method
ysocketio.initialize();
