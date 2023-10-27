import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./innkeeper-api-types";

export type InnkeeperSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
>;

type ChatMessage = {
  user: string;
  message: string;
};

export type BasicSocketEvents = {
  connect: () => void;
  disconnect: (reason: string) => void;
  connect_error: (err: Error) => void;
  sendChatMessage: (message: string) => void;
};

export type InnkeeperSocketEvents = ServerToClientEvents & BasicSocketEvents;
