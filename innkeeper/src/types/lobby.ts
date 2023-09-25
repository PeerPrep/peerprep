import { RemoteSocket, Server, Socket } from 'socket.io';
import { NotificationMessage } from 'types';

export type MatchingParameters = {
  questionDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
};

export type WaitingUsersCount = {
  totalWaitingUsers: number;
};

interface ServerToClientEvents {
  sendNotification: (notification: NotificationMessage) => void;

  /** Sent to only the specific users to exit the lobby and proceed to the room ID. */
  sendToRoom: (roomId: string) => void;

  /**
   * Broadcasts the available users to all on new user entry. Can be used to prompt users to change match request (or for debugging).
   * Note that numbers are always inclusive of recipient.
   *
   * For scalability, this could be sent in batch updates in the future.
   */
  availableMatches: (update: WaitingUsersCount) => void;
}

interface ClientToServerEvents {
  /** Use to set matching parameters to make a match. Note that it can be called repeatedly to change matching parameter. */
  makeMatchingRequest: (params: MatchingParameters) => void;
}

interface InterServerEvents {}

export interface InnkeeperSocketData {
  userId: string; // Primary key for Users table.
  roomId: string | null; // convenience field populated manually by server.
  lastMessage: number; // Last active timestamp in Unix time (seconds since epoch). 0 indicates user has never joined.
}

export type InnkeeperIoServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, InnkeeperSocketData>;
export type InnkeeperIoSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, InnkeeperSocketData>;
export type InnkeeperOtherSockets = RemoteSocket<ServerToClientEvents, InnkeeperSocketData>;
