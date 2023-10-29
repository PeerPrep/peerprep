import { isMatchedAtom, questionIdAtom } from "@/libs/room-jotai";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { fetchQuestionDescriptionUrl } from "@/app/api";

const ContentPane = () => {
  const questionId = useAtomValue(questionIdAtom);
  const [description, setDescription] = useState<string>("");
  useEffect(() => {
    if (questionId) {
      fetchQuestionDescriptionUrl(questionId).then((res) => {
        setDescription(res.payload.description);
      });
    }
  }, [questionId]);

  return (
    <ReactMarkdown className="prose h-[40svh] min-w-[90svw] overflow-auto rounded-b-md bg-secondary p-6 lg:h-[80svh] lg:min-w-[45svw] lg:max-w-[45svw]">
      {description ||
        "# Choose your question.\n A question has not been selected."}
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
      <ContentPane />
    </article>
  );
};

export default MarkdownQuestionPane;
