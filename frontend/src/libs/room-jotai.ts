import { atom } from "jotai";
export const codeLangAtom = atom("python");
export const isConnectedAtom = atom(false);
export const isQuestionModalOpenAtom = atom(false);

export const questionIdAtom = atom<string>("");
export const questionDifficultyAtom = atom<"EASY" | "MEDIUM" | "HARD" | null>(
  null,
);
