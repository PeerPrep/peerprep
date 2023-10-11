"use client";
import Button from "@/app/components/button/Button";
import MarkdownQuestionPane from "@/app/components/markdown-question-pane/MarkDownQuestionPane";
import StatusBar from "@/app/components/status-bar/StatusBar";
import { useInnkeeperSocket } from "@/app/hooks/useInnKeeper";
import {
  innkeeperWriteAtom,
  isConnectedAtom,
  isMatchedAtom,
  roomStateAtom,
} from "@/libs/room-jotai";
import { Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { atom, useAtom, useAtomValue } from "jotai";
import CodeEditor from "../../components/code-editor/CodeEditor";
import { useCollab } from "../../hooks/useCollab";

const userAtom = atom("user_a");

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

      {/* TextField and button that sets the value of setUser to the value of the textfield. */}
      <TextArea
        title="Change your username"
        value={user}
        onChange={(e) => (e ? setUser(e.target.value) : undefined)}
        size={"large"}
      />
    </section>
  );
};

const Editor = ({
  initialVersion,
  initialDoc,
}: {
  initialVersion: number;
  initialDoc: string;
}) => {
  const peerExtension = useCollab(initialVersion);

  return (
    <section className="flex flex-col items-center justify-center gap-4 p-6 lg:flex-row">
      <MarkdownQuestionPane />
      <CodeEditor extensions={[peerExtension]} value={initialDoc} />
    </section>
  );
};

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
      <Editor
        initialVersion={roomState.textEditor.version}
        initialDoc={roomState.textEditor.doc}
      />
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
