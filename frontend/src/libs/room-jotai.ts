import { atom } from "jotai";
import {
  ChatMessage,
  ClientToServerEvents,
  RoomState,
  UserState,
} from "./innkeeper-api-types";
import { InnkeeperSocket, InnkeeperSocketEvents } from "./innkeeper-types";
export const codeMirrorValueAtom = atom("");
export const resultAtom = atom("");
export const codeLangAtom = atom("python");
export const socketAtom = atom<InnkeeperSocket | null>(null);
export const isConnectedAtom = atom(false);
export const isQuestionModalOpenAtom = atom(false);
export const isQueuingAtom = atom(false);

/**
 * Note that the server only supports unmatched or matched, closed is a frontend
 * only state that allows us to show the user that the room has closed without
 * immediately redirecting them to the lobby.
 */
export const isMatchedAtom = atom<"UNMATCHED" | "MATCHED" | "CLOSED">(
  "UNMATCHED",
);

export const roomStateAtom = atom<RoomState | null>(null);
export const roomIdAtom = atom((get) => get(roomStateAtom)?.roomId);
export const userStatesAtom = atom(
  (get) => get(roomStateAtom)?.userStates,
  (get, set, update: [UserState, UserState]) => {
    const roomState = get(roomStateAtom);
    if (!roomState) {
      console.error("Room state not initialized but user state updated");
      return;
    }

    set(roomStateAtom, { ...roomState, userStates: update });
  },
);
export const questionIdAtom = atom(
  (get) => get(roomStateAtom)?.questionId,
  (get, set, update: string) => {
    const roomState = get(roomStateAtom);
    if (!roomState) {
      console.error("Room state not initialized but question id updated");
      return;
    }

    set(roomStateAtom, { ...roomState, questionId: update });
  },
);
export const chatHistoryAtom = atom(
  (get) => get(roomStateAtom)?.chatHistory,
  (get, set, update: ChatMessage[]) => {
    const roomState = get(roomStateAtom);
    if (!roomState) {
      console.error("Chat Message is updated, room state not initialized.");
      return;
    }
    set(roomStateAtom, { ...roomState, chatHistory: update });
  },
);

export const questionDifficultyAtom = atom(
  (get) => get(roomStateAtom)?.questionDifficulty,
);

export type JotaiInnkeeperListenAdapter = {
  [K in keyof InnkeeperSocketEvents]: (
    ...args: Parameters<InnkeeperSocketEvents[K]>
  ) => ReturnType<InnkeeperSocketEvents[K]>;
};

export type InnkeeperEmitEventType = {
  [K in keyof ClientToServerEvents]: {
    eventName: K;
    eventArgs: Parameters<ClientToServerEvents[K]>;
  };
}[keyof ClientToServerEvents];

export const innkeeperWriteAtom = atom(
  null,
  (get, set, args: InnkeeperEmitEventType) => {
    const socket = get(socketAtom);
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    console.dir({ ...args, at: "innkeeperWriteAtom" });
    const { eventName, eventArgs } = args;
    socket.emit(eventName, ...eventArgs);
  },
);
