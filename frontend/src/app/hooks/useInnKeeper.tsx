import {
  JotaiInnkeeperListenAdapter,
  isConnectedAtom,
  isMatchedAtom,
  roomStateAtom,
  socketAtom,
} from "@/libs/room-jotai";
import { ChangeSet } from "@uiw/react-codemirror";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import io from "socket.io-client";
import { triggerSyncAtom, writeChangeSetAtom } from "./useCollab";

function _useInnkeeperSocket(authToken: string) {
  const innkeeperUrl = process.env.NEXT_PUBLIC_PEERPREP_INNKEEPER_SOCKET_URL;
  const [socket, setSocket] = useAtom(socketAtom);

  const setIsConnected = useSetAtom(isConnectedAtom);
  const setIsMatched = useSetAtom(isMatchedAtom);
  const [roomState, setRoomState] = useAtom(roomStateAtom);
  const triggerDocumentSync = useSetAtom(triggerSyncAtom);
  const writeChangeSet = useSetAtom(writeChangeSetAtom);

  const jotaiAdapter: JotaiInnkeeperListenAdapter = {
    connect() {
      console.log("connected to innkeeper socket");
      setIsConnected(true);
    },

    disconnect() {
      console.log("disconnected from innkeeper socket");
      setIsConnected(false);
    },

    connect_error(error) {
      console.log("received connect error:", error);
    },

    sendNotification(message) {
      console.log("received notification:", message);
    },

    sendToRoom(message) {
      console.log("received sendToRoom:", message);

      setIsMatched("MATCHED");
    },

    availableMatches(message) {
      console.log("received matches:", message);
    },

    sendCompleteRoomState(roomState) {
      console.log("received complete room state:", roomState);

      setRoomState(roomState);
      const [u1, u2] = roomState.userStates;
      if (u1.status != "EXITED" && u2.status != "EXITED")
        setIsMatched("MATCHED");
    },

    sendPartialRoomState(partialUpdate) {
      console.log("received partial room state:", partialUpdate);
      if (!roomState) {
        console.error("roomState not set but partial room state received");
        return;
      }

      if (partialUpdate.questionId)
        setRoomState({ ...roomState, questionId: partialUpdate.questionId });
      if (partialUpdate.userStates)
        setRoomState({ ...roomState, userStates: partialUpdate.userStates });
    },

    pushDocumentChanges(changesets) {
      console.log(`received ${changesets.length} changesets from server`);
      const updates = changesets.map((u) => ({
        changes: ChangeSet.fromJSON(u.changes),
        clientID: u.clientID,
      }));

      console.log(`pushing ${updates.length} updates to editor`);
      writeChangeSet(updates);
      console.log(`wrote ${updates.length} updates to editor`);
    },

    sendDocumentChanged() {
      triggerDocumentSync();
    },

    closeRoom(finalUpdate) {
      setIsMatched("CLOSED");

      console.log("received partial room state:", finalUpdate);
    },
  };

  useEffect(() => {
    if (!innkeeperUrl) {
      console.error(
        "NEXT_PUBLIC_PEERPREP_INNKEEPER_SOCKET_URL not set in .env",
      );
      return;
    }

    console.log("connecting to innkeeper socket...");
    const socket = io(innkeeperUrl, {
      path: "/api/v1/innkeeper/",
      auth: {
        // This is the correct way to authenticate, but InnKeeper currently ignores this value
        token: authToken,
      },
      extraHeaders: {
        // This is the janky way InnKeeper authenticates rn.
        trustmefr: authToken,
      },
      autoConnect: false,
    });

    console.log("attaching jotai adapter to socket...");
    // Basic socket.io event handlers.
    socket.on("connect", () => jotaiAdapter.connect());
    socket.on("connect_error", (err) => jotaiAdapter.connect_error(err));
    socket.on("disconnect", (reason) => jotaiAdapter.disconnect(reason));

    // Custom socket.io event handlers.
    socket.onAny((event, ...args) => {
      // Run handler if it exists.
      if (event in jotaiAdapter) {
        console.log(`running ${event} handler with args: ${args}`);
        jotaiAdapter[event as keyof JotaiInnkeeperListenAdapter](...args);
      } else {
        console.error(`no handler set. Ignoring... ${event}(${args})`);
      }
    });

    setSocket(socket);
    socket.connect();

    const unsubscribe = () => {
      console.log("disconnecting from innkeeper socket...");
      socket?.disconnect();
      setSocket(null);
    };
    return unsubscribe;
  }, [authToken]);

  return { socket };
}

export const useInnkeeperSocket = _useInnkeeperSocket;
