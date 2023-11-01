import {
  JotaiInnkeeperListenAdapter,
  chatHistoryAtom,
  codeLangAtom,
  isConnectedAtom,
  isMatchedAtom,
  questionIdAtom,
  resultAtom,
  roomStateAtom,
  socketAtom,
  userStatesAtom,
} from "@/libs/room-jotai";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import io from "socket.io-client";

function _useInnkeeperSocket(authToken: string | null) {
  const innkeeperUrl = process.env.NEXT_PUBLIC_PEERPREP_INNKEEPER_SOCKET_URL;
  const [socket, setSocket] = useAtom(socketAtom);

  const setIsConnected = useSetAtom(isConnectedAtom);
  const setIsMatched = useSetAtom(isMatchedAtom);
  const setRoomState = useSetAtom(roomStateAtom);
  const setUserStates = useSetAtom(userStatesAtom);
  const setQuestionId = useSetAtom(questionIdAtom);
  const setChatHistory = useSetAtom(chatHistoryAtom);
  const setLanguage = useSetAtom(codeLangAtom);
  const setResult = useSetAtom(resultAtom);

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
      const [user1, user2] = roomState.userStates;
      if ("EXITED" in [user1.status, user2.status]) {
        setIsMatched("CLOSED");
      } else {
        setIsMatched("MATCHED");
      }
    },

    sendPartialRoomState(partialUpdate) {
      console.log("received partial room state:", partialUpdate);
      if (partialUpdate.chatHistory) setChatHistory(partialUpdate.chatHistory);
      if (partialUpdate.userStates) setUserStates(partialUpdate.userStates);
      if (partialUpdate.questionId) setQuestionId(partialUpdate.questionId);
      if (partialUpdate.language) setLanguage(partialUpdate.language);
      if (partialUpdate.executionResult)
        setResult(partialUpdate.executionResult);
    },

    closeRoom(finalUpdate) {
      setIsMatched("CLOSED");
      setRoomState(finalUpdate);

      console.log("received  room state:", finalUpdate);
    },
  };

  useEffect(() => {
    if (!innkeeperUrl) {
      console.error(
        "NEXT_PUBLIC_PEERPREP_INNKEEPER_SOCKET_URL not set in .env",
      );
      return;
    }

    if (!authToken) {
      console.error("authToken not set");
      return;
    }

    console.log("connecting to innkeeper socket...");
    const socket = io(innkeeperUrl, {
      path: "/api/v1/innkeeper/",
      auth: {
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
