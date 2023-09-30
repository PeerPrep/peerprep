import { RemoteSocket, Server, Socket } from 'socket.io';
import { ClientToServerEvents, InnkeeperSocketData, InterServerEvents, ServerToClientEvents } from './innkeeper-api-types';
export {
  ClientToServerEvents,
  InnkeeperSocketData,
  InterServerEvents,
  MatchingParameters,
  NotificationMessage,
  PartialRoomState,
  RoomState,
  ServerToClientEvents,
  TextEditorState,
  UserState,
  UserUpdate,
  WaitingUsersCount,
} from './innkeeper-api-types';

export type InnkeeperIoServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, InnkeeperSocketData>;
export type InnkeeperIoSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, InnkeeperSocketData>;
export type InnkeeperOtherSockets = RemoteSocket<ServerToClientEvents, InnkeeperSocketData>;
