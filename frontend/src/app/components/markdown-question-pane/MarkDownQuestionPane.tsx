import {
  innkeeperWriteAtom,
  isMatchedAtom,
  questionIdAtom,
} from "@/libs/room-jotai";
import TextArea from "antd/lib/input/TextArea";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { markdownExample } from "./markdownExample";

const triggerQuestionIdUpdateRequestAtom = atom(
  null,
  (get, set, questionId: string) => {
    set(innkeeperWriteAtom, {
      eventName: "sendUpdate",
      eventArgs: [{ questionId }],
    });
  },
);

// TODO: not sure what FE wants for this so I slapped together something random for now.
const QuestionPicker = () => {
  const [questionId, setQuestionId] = useState<string>("");
  const updateQuestionId = useSetAtom(triggerQuestionIdUpdateRequestAtom);
  const setAndUpdate = (q: string) => {
    setQuestionId(q);
    updateQuestionId(q);
  };

  return (
    <TextArea
      title="QN:"
      value={questionId}
      onChange={(e) => (e ? setAndUpdate(e.target.value) : undefined)}
      size={"small"}
    />
  );
};

const ContentPane = () => {
  const questionId = useAtomValue(questionIdAtom);
  const question = questionId
    ? `# Question ${questionId}\n` + markdownExample
    : `# Choose your question.\n A question has not been selected.`;

  return (
    <ReactMarkdown className="prose h-[40svh] min-w-[90svw] overflow-auto rounded-b-md bg-secondary p-6 lg:h-[80svh] lg:min-w-[45svw] lg:max-w-[45svw]">
      {question}
    </ReactMarkdown>
  );
};

const MarkdownQuestionPane = () => {
  const isMatched = useAtomValue(isMatchedAtom);
  return (
    <article className="flex flex-col items-center">
      <h2 className="w-[90svw] rounded-t-md bg-primary p-2 text-2xl font-bold lg:w-[45svw] lg:px-6">
        Description
      </h2>
      {isMatched === "MATCHED" && <QuestionPicker />}
      <ContentPane />
    </article>
  );
};

export default MarkdownQuestionPane;
