"use client";
import { useState } from "react";
import QueueButton from "../button/QueueButton";
import { QuestionType } from "../../admin/question/page";
import { atom, useAtom } from "jotai";
import { innkeeperWriteAtom, isQueuingAtom } from "@/libs/room-jotai";
import ReactMarkdown from "react-markdown";

const sendMatchRequestAtom = atom(
  null,
  (get, set, questionDifficulty: "EASY" | "MEDIUM" | "HARD") => {
    set(innkeeperWriteAtom, {
      eventName: "makeMatchingRequest",
      eventArgs: [{ questionDifficulty }],
    });
  },
);

const MatchingPage = () => {
  const [currQn, setCurrQn] = useState<QuestionType | null>(null);

  const sendMatchRequest: (
    questionDifficulty: "EASY" | "MEDIUM" | "HARD",
  ) => void = useAtom(sendMatchRequestAtom)[1];

  const [isQueueing, setIsQueueing] = useAtom(isQueuingAtom);

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "EASY",
  );

  const handleChangeDiff = (difficulty: "EASY" | "MEDIUM" | "HARD") => {
    if (!isQueueing) {
      setDifficulty(difficulty);
    }
  };

  return (
    <>
      <main className="flex h-full flex-col items-center justify-center">
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box max-w-4xl p-6">
            <form method="dialog" className="pb">
              <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                ✕
              </button>
            </form>
            <ReactMarkdown className="prose min-w-[40svh] max-w-none rounded-b-md bg-secondary p-6">
              {currQn?.description || ""}
            </ReactMarkdown>
          </div>
        </dialog>
        <section className="flex items-center gap-4">
          <label>
            <span>Difficulty Setting:</span>
          </label>
          <div className="join">
            <button
              type="button"
              className={`btn btn-primary join-item text-white ${
                difficulty == "EASY" && "btn-success"
              }`}
              onClick={() => handleChangeDiff("EASY")}
            >
              Easy
            </button>
            <button
              type="button"
              className={`btn btn-primary join-item text-white ${
                difficulty == "MEDIUM" && "btn-warning"
              }`}
              onClick={() => handleChangeDiff("MEDIUM")}
            >
              Medium
            </button>
            <button
              type="button"
              className={`btn btn-primary join-item text-white ${
                difficulty == "HARD" && "btn-error"
              }`}
              onClick={() => handleChangeDiff("HARD")}
            >
              Hard
            </button>
          </div>
          <QueueButton
            enterQueue={() => {
              setIsQueueing(true);
              sendMatchRequest(difficulty);
            }}
            selectedDifficulty={difficulty}
          />
        </section>
      </main>
    </>
  );
};

export default MatchingPage;
