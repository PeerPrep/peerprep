import { atom } from "jotai";
import { ClientToServerEvents, RoomState } from "./innkeeper-api-types";
import { InnkeeperSocket, InnkeeperSocketEvents } from "./innkeeper-types";

export const socketAtom = atom<InnkeeperSocket | null>(null);
export const isConnectedAtom = atom(false);

/**
 * Note that the server only supports unmatched or matched, closed is a frontend
 * only state that allows us to show the user that the room has closed without
 * immediately redirecting them to the lobby.
 */
export const isMatchedAtom = atom<"UNMATCHED" | "MATCHED" | "CLOSED">(
  "UNMATCHED",
);

export const roomStateAtom = atom<RoomState | null>(null);

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

    const { eventName, eventArgs } = args;
    console.log(`Emitting ${eventName} with args: ${eventArgs}`);
    socket.emit(eventName, ...eventArgs);
  },
);
