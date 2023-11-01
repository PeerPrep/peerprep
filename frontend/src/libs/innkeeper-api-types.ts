export type NotificationMessage = {
  type: "SUCCESS" | "ERROR" | "INFO";
  message: string;
};

export type MatchingParameters = {
  questionDifficulty: "EASY" | "MEDIUM" | "HARD";
};

export type WaitingUsersCount = {
  totalWaitingUsers: number;
};

export type UserId = {
  userId: string;
  displayName: string;
  imageUrl: string;
};

export type UserState = {
  userId: string;
  displayName: string;
  imageUrl: string;
  status: "INACTIVE" | "ACTIVE" | "EXITED";
  lastSeen: number; // Unix time (seconds since epoch)
};

export type UserUpdate = {}; // Depends on @codemirror/collab types. Left empty for now.
export type TextEditorState = {
  code: string;
};

export type ChatMessage = {
  user: string;
  message: string;
};

export type RoomState = {
  roomId: string;
  questionId: string;
  userStates: [UserState, UserState];
  chatHistory: ChatMessage[];
  questionDifficulty: "EASY" | "MEDIUM" | "HARD";
};

/**
 * Pushes only the update required to subscribers.
 * Note that UserState changes will only be pushed if the status changes. (i.e. not for lastSeen)
 */
export type PartialRoomState = {
  questionId?: string;
  userStates?: [UserState, UserState];
  chatHistory?: ChatMessage[];
  executionResult?: string;
  language?: string;
  questionDifficulty?: "EASY" | "MEDIUM" | "HARD";
};

export interface ServerToClientEvents {
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

  /** Updates every user in a room on the last complete state. */
  sendCompleteRoomState: (update: RoomState) => void;

  /** Updates every user on any changes to the last emitted room state. */
  sendPartialRoomState: (update: PartialRoomState) => void;

  /**
   * Returns the last complete state, and notifies all users in a room that they must exit too.
   * Checking the user states will reveal one 'EXITED' user who initiated the closing.
   */
  closeRoom: (update: RoomState) => void;
}

export interface ClientToServerEvents {
  /** Use to set matching parameters to make a match. Note that it can be called repeatedly to change matching parameter. */
  makeMatchingRequest: (params: MatchingParameters) => void;

  /** Placeholder function, true signature will depend on @codemirror/collab */
  sendUpdate: (update: PartialRoomState) => void;

  /** Requests for the complete state of the room. May be used after losing connection. */
  requestCompleteRoomState: () => void;

  /** Indicates one user wishes to leave. This will trigger server to send closeRoom() to notify the other participant. */
  leaveRoom: () => void;
  sendChatMessage: (update: string) => void;
  leaveQueue: () => void;
}

export interface InterServerEvents {}

export interface InnkeeperSocketData {
  userId: string; // Primary key for Users table.
  displayName: string; // Display name for user.
  roomId: string | null; // convenience field populated manually by server.
  lastMessage: number; // Last active timestamp in Unix time (seconds since epoch). 0 indicates user has never joined.
}
