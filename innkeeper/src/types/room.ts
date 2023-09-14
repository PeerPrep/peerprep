import { Namespace, RemoteSocket, Socket } from 'socket.io';
import { NotificationMessage } from 'types';
import { InnkeeperSocketData } from './lobby';

export type Question = {};
export type UserState = {
  userId: string;
  status: 'INACTIVE' | 'ACTIVE' | 'EXITED';
  lastSeen: number; // Unix time (seconds since epoch)
};

export type UserUpdate = {}; // Depends on @codemirror/collab types. Left empty for now.
export type TextEditorState = {}; // Depends on @codemirror/state types. Left empty for now.

// Only used for reconnecting users / when users have lost history.
export type RoomState = {
  roomId: string;
  question: Question;
  textEditor: TextEditorState;
  userStates: [UserState, UserState];
};

export type PartialRoomState = {
  question?: Partial<Question>;
  textEditor?: Partial<TextEditorState>;
  userStates?: [UserState, UserState];
};

interface ServerToClientEvents {
  sendNotification: (notification: NotificationMessage) => void;

  /** Updates every user on the last complete state. */
  sendCompleteRoomState: (update: RoomState) => void;

  /** Updates every user on any changes to the last emitted state. */
  sendPartialRoomState: (update: PartialRoomState) => void;

  /** Returns the last complete state, and notifies any active user that this room is closed. */
  closeRoom: (update: RoomState) => void;
}

interface ClientToServerEvents {
  /** Requests for the complete state of the room. May be used after losing connection. */
  requestCompleteRoomState: () => void;

  /** Indicates one user wishes to leave. This will trigger server to send closeRoom() to notify the other participant. */
  leaveRoom: () => void;
}

interface InterServerEvents {}

export type RoomIoNamespace = Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, InnkeeperSocketData>;
export type RoomIoSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, InnkeeperSocketData>;
export type RoomOtherSockets = RemoteSocket<ServerToClientEvents, InnkeeperSocketData>;
