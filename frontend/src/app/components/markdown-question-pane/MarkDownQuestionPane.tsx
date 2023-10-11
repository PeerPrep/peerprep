import ReactMarkdown from "react-markdown";
import { markdownExample } from "./markdownExample";

const MarkdownQuestionPane = () => {
  return (
    <article className="flex flex-col items-center">
      <h2 className="w-[90svw] rounded-t-md bg-primary p-2 text-2xl font-bold lg:w-[45svw] lg:px-6">
        Description
      </h2>
      <ReactMarkdown className="prose h-[40svh] min-w-[90svw] overflow-auto rounded-b-md bg-secondary p-6 lg:h-[80svh] lg:min-w-[45svw] lg:max-w-[45svw]">
        {markdownExample}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownQuestionPane;
