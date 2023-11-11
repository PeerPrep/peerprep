"use client";
import { fetchProfileUrl } from "@/app/api";
import { atom, useAtom } from "jotai";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import Tabs from "../tab/Tabs";

import { BsArrowsExpand } from "react-icons/bs";

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

let desiredWidth = "50vw";
if (typeof window !== "undefined") {
  desiredWidth = window.innerWidth >= 1024 ? "50vw" : "90vw";
}

const codeLangAtom = atom<string>("python");
const CodeMirrorEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useAtom(codeLangAtom);

  useEffect(() => {
    fetchProfileUrl().then((res) => {
      setSelectedLanguage(res.payload.preferredLang || "python");
    });
  }, []);

  let maxHeight = 0;
  if (typeof window !== "undefined") {
    maxHeight = window.innerHeight * 0.7;
  }

  return (
    <section className="flex flex-col items-center">
      <div className="flex w-[90svw] items-center justify-between rounded-t-md bg-primary p-2 px-6 lg:w-[50svw]">
        <h2 className="text-2xl font-bold">Notepad</h2>
      </div>
      <CodeMirror
        className="max-h-[70svw] w-[90svw] lg:w-[50svw]"
        height={`${600}px`}
        theme="dark"
        basicSetup={false}
        id="codeEditor"
        value="Just a scratchpad, nothing is saved."
      />
      <div className="divider mx-auto w-[90svw] cursor-ns-resize hover:bg-accent lg:w-full">
        <BsArrowsExpand className="text-state-100 text-4xl" />
      </div>
      <Tabs height={Math.min(window.innerHeight * 0.7 - 600, maxHeight)} />
    </section>
  );
};

export default CodeMirrorEditor;
