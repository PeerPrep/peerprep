"use client";

import CodeMirrorEditor from "@/app/components/code-editor/CodeEditor";
import MarkdownQuestionPane from "@/app/components/markdown-question-pane/MarkDownQuestionPane";
import StatusBar from "@/app/components/status-bar/StatusBar";
import { getAuth } from "firebase/auth";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { FetchAuth } from "../api";
import QuestionModal from "../components/modal/QuestionModal";
type UserDetails = { displayName: string; authToken: string };
const userDetailsAtom = atom<UserDetails | null>(null);

import MatchingPage from "../components/matching/MatchingPage";

const difficultyAtom = atom<"EASY" | "MEDIUM" | "HARD" | null>(null);

const roomPage = () => {
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [difficulty, setDifficulty] = useAtom(difficultyAtom);
  useEffect(() => {
    FetchAuth.getFirebaseToken().then((authToken) => {
      const displayName = getAuth().currentUser?.displayName ?? "Anonymous";
      setUserDetails({ displayName, authToken });
    });
  }, []);

  if (!userDetails) {
    return (
      <section className="flex flex-row items-center justify-center gap-4 p-6 lg:flex-row">
        <h1 className="text-4xl font-bold">Checking your login status...</h1>
      </section>
    );
  }

  if (!difficulty) {
    return <MatchingPage onConfirm={setDifficulty} />;
  }

  return (
    <>
      <QuestionModal
        difficulty={difficulty}
        returnToDifficultySelection={() => setDifficulty(null)}
      />
      <div className="flex h-full flex-col justify-between">
        <section className="flex flex-col justify-center gap-4 pb-14 pt-4 lg:flex-row lg:pb-0">
          <MarkdownQuestionPane />
          <CodeMirrorEditor />
        </section>
        <StatusBar exitMethod={() => setDifficulty(null)} />
      </div>
    </>
  );
};

export default roomPage;
