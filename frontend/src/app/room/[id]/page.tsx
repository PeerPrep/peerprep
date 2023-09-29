"use client";
import Button from "@/app/components/button/Button";
import CodeMirrorEditor from "@/app/components/code-editor/CodeEditor";
import MarkdownQuestionPane from "@/app/components/markdown-question-pane/MarkDownQuestionPane";
import { useInnkeeperSocket } from "@/app/hooks/useInnKeeper";
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

  return (
    <section className="flex flex-col items-center justify-center gap-4 p-6 lg:flex-row">
      <MarkdownQuestionPane />
      <CodeMirrorEditor value={code} onChange={setCode} />
    </section>
  );
};

export default roomPage;
