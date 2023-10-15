"use client";
import Button from "@/app/components/button/Button";
import CodeMirrorEditor from "@/app/components/code-editor/CodeEditor";
import MarkdownQuestionPane from "@/app/components/markdown-question-pane/MarkDownQuestionPane";
import StatusBar from "@/app/components/status-bar/StatusBar";
import { useInnkeeperSocket } from "@/app/hooks/useInnKeeper";
import { RoomState } from "@/libs/innkeeper-api-types";
import {
  innkeeperWriteAtom,
  isConnectedAtom,
  isMatchedAtom,
  roomStateAtom,
} from "@/libs/room-jotai";
import { EditorState } from "@uiw/react-codemirror";
import { Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { yCollab } from "y-codemirror";
import { SocketIOProvider } from "y-socket.io";
import * as Y from "yjs";

const sendMatchRequestAtom = atom(
  null,
  (get, set, questionDifficulty: "EASY" | "MEDIUM" | "HARD") => {
    set(innkeeperWriteAtom, {
      eventName: "makeMatchingRequest",
      eventArgs: [{ questionDifficulty }],
    });
  },
);

const Lobby = ({ user, setUser }: any) => {
  const sendMatchRequest: (
    questionDifficulty: "EASY" | "MEDIUM" | "HARD",
  ) => void = useAtom(sendMatchRequestAtom)[1];

  return (
    <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
      <h1 className="text-4xl font-bold">
        Choose a question difficulty, '{user}':
      </h1>
      <Space>
        <Button onClick={() => sendMatchRequest("EASY")}>Easy</Button>
        <Button onClick={() => sendMatchRequest("MEDIUM")}>Medium</Button>
        <Button onClick={() => sendMatchRequest("HARD")}>Hard</Button>
      </Space>

      <TextArea
        title="Change your username"
        value={user}
        onChange={(e) => (e ? setUser(e.target.value) : undefined)}
        size={"large"}
      />
    </section>
  );
};

const docAtom = atom<Y.Doc | null>(null);
const roomIdAtom = atom<string | null>(null);
const yjsProviderAtom = atom<SocketIOProvider | null>(null);

const Editor = ({
  user,
  roomState,
}: {
  user: string;
  roomState: RoomState;
}) => {
  const [user1, user2] = roomState.userStates;
  const roomId = roomState.roomId;

  const [doc, setDoc] = useAtom(docAtom);
  const [provider, setProvider] = useAtom(yjsProviderAtom);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId) {
      console.error("No room id yet!");
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId && !doc) {
      console.log("setting doc");
      const _doc = new Y.Doc();
      setDoc(_doc);
    }
  }, [roomId, doc]);

  useEffect(() => {
    if (roomId && doc && !provider) {
      console.log("setting providers");
      const socketIOProvider = new SocketIOProvider(
        process.env.NEXT_PUBLIC_INNKEEPER_URL!,
        roomId,
        doc,
        {
          autoConnect: true,
          // disableBc: true,
          // auth: { token: 'valid-token' },
        },
      );
      socketIOProvider.awareness.setLocalState({
        id: Math.random(),
        name: user,
      });
      socketIOProvider.on("sync", (isSync: boolean) =>
        console.log("websocket sync", isSync),
      );
      socketIOProvider.on(
        "status",
        ({ status: _status }: { status: string }) => {
          if (!!_status) setConnected(true);
        },
      );
      setProvider(socketIOProvider);
    }
  }, [roomId, doc, provider]);

  //For status bar
  const executeFunction = () => undefined;

  if (!connected) return <h1>Connecting...</h1>;

  const yText = doc!.getText("code");
  const undoManager = new Y.UndoManager(yText);
  const state = EditorState.create({
    doc: yText.toString(),
    extensions: [
      basicSetup,
      javascript(),
      yCollab(yText, provider!.awareness, { undoManager }),
    ],
  });

  return (
    <div className="flex h-full flex-col justify-between">
      <section className="flex flex-col justify-center gap-4 pb-14 pt-4 lg:flex-row lg:pb-0">
        <MarkdownQuestionPane />
        <CodeMirrorEditor value={code} onChange={setCode} />
      </section>
      <StatusBar
        exitMethod={executeFunction}
        executeFunction={executeFunction}
        user1State={user1}
        user2State={user2}
      />
    </div>
  );
};

const userAtom = atom("user_a");

const roomPage = () => {
  const [user, setUser] = useAtom(userAtom);
  useInnkeeperSocket(user);

  const isConnected = useAtomValue(isConnectedAtom);
  const isMatched = useAtomValue(isMatchedAtom);
  const roomState = useAtomValue(roomStateAtom);

  if (!isConnected) {
    console.log({ isConnected, at: "rendering room page" });
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Connecting to InnKeeper...</h1>
      </section>
    );
  }

  if (isMatched !== "MATCHED" && isMatched !== "CLOSED") {
    return <Lobby user={user} setUser={setUser} />;
  }

  // Connected, matched but hasn't received room state yet.
  if (!roomState) {
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </section>
    );
  }

  return <Editor user={user} roomState={roomState} />;
};

export default roomPage;
