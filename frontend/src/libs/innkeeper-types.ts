import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./innkeeper-api-types";

export type InnkeeperSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export type BasicSocketEvents = {
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (err: Error) => void;
};

export type InnkeeperSocketEvents = ServerToClientEvents & BasicSocketEvents;
