import { Dispatch } from "react";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./innkeeper-api-types";

export type InnkeeperSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

type InnkeeperSocketEvents = ServerToClientEvents & {
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (err: Error) => void;
};

const x: Parameters<ServerToClientEvents["sendNotification"]> = [
  { message: "hello", type: "SUCCESS" },
];

export type InnkeeperSocketHandlers<State, DispatchAction> = {
  [K in keyof InnkeeperSocketEvents]: (
    // Allows for handlers to directly use socket.emit() and other functions if needed.
    socket: InnkeeperSocket,

    // Since most handlers will operate on state of some sort, this offers a way to pass in frontend reducers.
    state: State,

    dispatch: Dispatch<DispatchAction>,

    // Actual parameters of the server event.
    ...args: Parameters<InnkeeperSocketEvents[K]>
  ) => ReturnType<InnkeeperSocketEvents[K]>;
};
