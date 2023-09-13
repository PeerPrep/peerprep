"use client";
import { ViewUpdate } from "@uiw/react-codemirror";
import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";

type CodeMirrorOnChangeProps = (value: string, viewUpdate: ViewUpdate) => void;

let desiredWidth = "45vw";
if (window !== undefined) {
  desiredWidth = window.innerWidth >= 1024 ? "45vw" : "90vw";
}

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={desiredWidth}
      count={25}
      baseColor="#383D4B"
      highlightColor="#22242D"
    />
  ),
});

const CodeMirrorEditor = ({
  onChange,
}: {
  onChange: CodeMirrorOnChangeProps;
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [languageExtension, setLanguageExtension] = useState<any>(null);

  useEffect(() => {
    async function loadLanguageExtension() {
      switch (selectedLanguage) {
        case "javascript":
          const { javascript } = await import("@codemirror/lang-javascript");
          setLanguageExtension(javascript());
          break;
        case "python":
          const { python } = await import("@codemirror/lang-python");
          setLanguageExtension(python());
          break;
        case "java":
          const { java } = await import("@codemirror/lang-java");
          setLanguageExtension(java());
          break;
        case "cpp":
          const { cpp } = await import("@codemirror/lang-cpp");
          setLanguageExtension(cpp());
          break;
        default:
          setLanguageExtension(null);
          break;
      }
    }
    loadLanguageExtension();
  }, [selectedLanguage]);

  return (
    <section>
      <div className="flex items-center justify-between rounded-t-md bg-primary p-2 px-6">
        <h2 className="text-2xl font-bold">Code Editor</h2>
        <div className="flex items-center gap-4">
          <h3>Language:</h3>
          <select
            className="h-8 w-fit rounded-md bg-secondary px-2"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
      <CodeMirror
        className="w-[90svw] lg:w-[50svw]"
        height="80vh"
        value="console.log('hello world!');"
        theme="dark"
        extensions={languageExtension}
        onChange={onChange}
      />
    </section>
  );
};

export default CodeMirrorEditor;
