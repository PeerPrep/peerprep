import ReactMarkdown from "react-markdown";
import { markdownExample } from "./markdownExample";

const MarkdownQuestionPane = () => {
  return (
    <article>
      <h2 className="rounded-t-md bg-primary p-2 px-6 text-2xl font-bold">
        Description
      </h2>
      <ReactMarkdown className="prose h-[40svh] min-w-[90svw] overflow-y-scroll rounded-b-md bg-secondary p-6 lg:h-[80svh] lg:min-w-[45svw]">
        {markdownExample}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownQuestionPane;
