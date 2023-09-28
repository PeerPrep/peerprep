"use client";
import CodeMirrorEditor from "@/app/components/code-editor/CodeEditor";
import MarkdownQuestionPane from "@/app/components/markdown-question-pane/MarkDownQuestionPane";
import { ViewUpdate } from "@uiw/react-codemirror";
import { useCallback } from "react";

const roomPage = () => {
  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    console.log("value:", value);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 p-6 lg:flex-row">
      <MarkdownQuestionPane />
      <CodeMirrorEditor onChange={onChange} />
    </section>
  );
};

export default roomPage;
