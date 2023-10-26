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
  roomIdAtom,
} from "@/libs/room-jotai";
import { Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { atom, useAtom, useAtomValue } from "jotai";

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

const userAtom = atom("user_");

const roomPage = () => {
  const [user, setUser] = useAtom(userAtom);
  useInnkeeperSocket(user);

  const isConnected = useAtomValue(isConnectedAtom);
  const isMatched = useAtomValue(isMatchedAtom);
  const roomId = useAtomValue(roomIdAtom);
  console.dir({ isConnected, isMatched, roomId, at: "rendering room page" });

  if (!isConnected) {
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
  if (!roomId) {
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </section>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <section className="flex flex-col justify-center gap-4 pb-14 pt-4 lg:flex-row lg:pb-0">
        <MarkdownQuestionPane />
        <CodeMirrorEditor userId={user} authToken={user} roomId={roomId} />
      </section>
      <StatusBar
        exitMethod={executeFunction}
        executeFunction={executeFunction}
      />
    </div>
  );
};

export default roomPage;
