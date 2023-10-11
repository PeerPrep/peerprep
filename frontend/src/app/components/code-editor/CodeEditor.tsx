"use client";
import { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import ResultsTab from "../tab/ResultsTab";

let desiredWidth = "50vw";
if (typeof window !== "undefined") {
  desiredWidth = window.innerWidth >= 1024 ? "50vw" : "90vw";
}

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={desiredWidth}
      count={30}
      baseColor="#383D4B"
      highlightColor="#22242D"
    />
  ),
});

const CodeMirrorEditor = ({
  value,
  extensions,
}: {
  value: ReactCodeMirrorProps["value"];
  extensions: ReactCodeMirrorProps["extensions"];
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [languageExtension, setLanguageExtension] = useState<any>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0); // To track the Y position where drag started
  const [editorHeight, setEditorHeight] = useState<number>(600);
  const [initialHeight, setInitialHeight] = useState<number>(0); // Store the initial height when starting to drag

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true);
    setStartY(e.clientY);
    setInitialHeight(editorHeight);
  };
  let maxHeight = 0;

  if (typeof window !== "undefined") {
    maxHeight = window.innerHeight * 0.7;
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const diffY = e.clientY - startY;
      setEditorHeight(Math.min(initialHeight + diffY, maxHeight));
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, startY, initialHeight]);

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
    <section className="flex flex-col items-center">
      <div className="flex w-[90svw] items-center justify-between rounded-t-md bg-primary p-2 px-6 lg:w-[50svw]">
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
        className="max-h-[70svw] w-[90svw] lg:w-[50svw]"
        height={`${editorHeight}px`}
        theme="dark"
        basicSetup={false}
        id="codeEditor"
        extensions={[languageExtension, ...(extensions ?? [])]}
        value={value}
      />
      <div
        className="divider mx-auto w-[90svw] cursor-ns-resize lg:w-full"
        onMouseDown={handleMouseDown}
      />
      <ResultsTab
        height={Math.min(window.innerHeight * 0.7 - editorHeight, maxHeight)}
      />
    </section>
  );
};

export default CodeMirrorEditor;
