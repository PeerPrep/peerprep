"use client";
import Button from "@/app/components/button/Button";
import CodeMirrorEditor from "@/app/components/code-editor/CodeEditor";
import MarkdownQuestionPane from "@/app/components/markdown-question-pane/MarkDownQuestionPane";
import StatusBar from "@/app/components/status-bar/StatusBar";
import { useInnkeeperSocket } from "@/app/hooks/useInnKeeper";
import {
  innkeeperWriteAtom,
  isConnectedAtom,
  isMatchedAtom,
  roomStateAtom,
  textEditorAtom,
} from "@/libs/room-jotai";
import { Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { atom, useAtom, useAtomValue } from "jotai";

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

const userAtom = atom("user_a");

const roomPage = () => {
  const [user, setUser] = useAtom(userAtom);
  useInnkeeperSocket(user);

  const isConnected = useAtomValue(isConnectedAtom);
  const isMatched = useAtomValue(isMatchedAtom);
  const roomState = useAtomValue(roomStateAtom);
  const [code, setCode] = useAtom(codeAtom);

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

  //For status bar

  const executeFunction = () => undefined;

  // Connected, matched but hasn't received room state yet.
  if (!roomState) {
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </section>
    );
  }

  const [user1, user2] = roomState.userStates;

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
