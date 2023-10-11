"use client";
import Button from "@/app/components/button/Button";
import CodeMirrorEditor from "@/app/components/code-editor/CodeEditor";
import MarkdownQuestionPane from "@/app/components/markdown-question-pane/MarkDownQuestionPane";
import StatusBar from "@/app/components/status-bar/StatusBar";
import ResultsTab from "@/app/components/tab/ResultsTab";
import { useInnkeeperSocket } from "@/app/hooks/useInnKeeper";
import { UserState } from "@/libs/innkeeper-api-types";
import {
  innkeeperWriteAtom,
  isConnectedAtom,
  isMatchedAtom,
  textEditorAtom,
} from "@/libs/room-jotai";
import { Space } from "antd";
import { atom, useAtom } from "jotai";

const codeAtom = atom(
  (get) => get(textEditorAtom)?.code,
  (get, set, update: string) => {
    if (get(textEditorAtom)?.code === update) return;

    set(innkeeperWriteAtom, {
      eventName: "sendUpdate",
      eventArgs: [{ textEditor: { code: update } }],
    });
  },
);

const sendMatchRequestAtom = atom(
  null,
  (get, set, questionDifficulty: "EASY" | "MEDIUM" | "HARD") => {
    set(innkeeperWriteAtom, {
      eventName: "makeMatchingRequest",
      eventArgs: [{ questionDifficulty }],
    });
  },
);

const Lobby = () => {
  const sendMatchRequest: (
    questionDifficulty: "EASY" | "MEDIUM" | "HARD",
  ) => void = useAtom(sendMatchRequestAtom)[1];

  return (
    <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
      <h1 className="text-4xl font-bold">Choose a question difficulty...</h1>
      <Space>
        <Button onClick={() => sendMatchRequest("EASY")}>Easy</Button>
        <Button onClick={() => sendMatchRequest("MEDIUM")}>Medium</Button>
        <Button onClick={() => sendMatchRequest("HARD")}>Hard</Button>
      </Space>
    </section>
  );
};

const roomPage = () => {
  useInnkeeperSocket("user_a");
  const isConnected = useAtom(isConnectedAtom)[0];
  const isMatched = useAtom(isMatchedAtom)[0];
  const [code, setCode] = useAtom(codeAtom);

  if (!isConnected) {
    console.log({ isConnected });
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Connecting to InnKeeper...</h1>
      </section>
    );
  }

  if (isMatched !== "MATCHED" && isMatched !== "CLOSED") {
    return <Lobby />;
  }

  //For status bar

  const executeFunction = () => undefined;

  const user1: UserState = {
    userId: "hello 1",
    status: "ACTIVE",
    lastSeen: 10,
  };

  const user2: UserState = {
    userId: "hello 1",
    status: "EXITED",
    lastSeen: 10,
  };

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

export default roomPage;
