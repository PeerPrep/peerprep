"use client";
import { QuestionType } from "@/app/admin/question/page";
import { fetchAllQuestionsUrl } from "@/app/api";
import { questionIdAtom } from "@/libs/room-jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Select, { SingleValue } from "react-select";

interface SelectedOptionType {
  label: string;
  value: number;
}

const QuestionModal = ({
  isOpen,
  setIsOpen,
  difficulty,
  returnToDifficultySelection,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  returnToDifficultySelection: () => void;
}) => {
  const [questionId, setQuestionId] = useAtom(questionIdAtom);

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const questionDifficulty = difficulty.toLowerCase();

  useEffect(() => {
    fetchAllQuestionsUrl().then((res) => {
      setQuestions(
        res.payload.filter((question: any) => {
          const curQnDifficulty = question.difficulty.toLowerCase();
          return curQnDifficulty === questionDifficulty;
        }),
      );
    });
  }, []);

  const options: SelectedOptionType[] = questions.map((question, i) => {
    return {
      label: question.title as string,
      value: i,
    };
  });

  let color;

  switch (questionDifficulty) {
    case "easy":
      color = "bg-success text-white";
      break;
    case "medium":
      color = "bg-warning text-white";
      break;
    case "hard":
      color = "bg-error text-white";
      break;
  }

  const [selectedQn, setSelectedQn] =
    useState<SingleValue<SelectedOptionType>>();

  const handleSelectChange = (
    selectedOption: SingleValue<SelectedOptionType>,
  ) => {
    setSelectedQn(selectedOption);
    setQuestionId(
      questions.find((qn) => qn.title === selectedOption?.label)?._id ?? "",
    );
  };

  const onClickStart = () => {
    setIsOpen(false);
    setQuestionId(
      questions.find((qn) => qn.title === selectedQn?.label)?._id ?? "",
    );
  };

  return (
    <>
      <input
        type="checkbox"
        onChange={() => undefined}
        checked={isOpen || questionId === ""}
        className="modal-toggle"
      />
      <dialog id="question-modal" className="modal">
        <div className="modal-box flex h-96 min-w-[40svw] flex-col gap-6 bg-secondary p-0">
          <h1 className="bg-primary p-4 text-4xl font-bold text-white">
            <div className="flex items-center justify-between">
              Select a Question
              <AiFillCloseCircle
                className="text-3xl text-error hover:cursor-pointer hover:text-red-500"
                onClick={() => {
                  if (questionId === "") {
                    returnToDifficultySelection();
                  } else {
                    setIsOpen(false);
                  }
                }}
              />
            </div>
          </h1>
          <h2 className="text-semibold flex items-center justify-center text-2xl text-white">
            Interview Difficulty:
            {
              <span
                className={`ml-4 rounded-md text-xl uppercase ${color} p-2 text-white shadow-md`}
              >
                {questionDifficulty}
              </span>
            }
          </h2>
          <div className="mb-auto flex items-center justify-center gap-4">
            <h3 className="text-xl text-white">Question: </h3>
            <Select
              placeholder="Select Question"
              options={options}
              onChange={handleSelectChange}
              className="w-96 text-black"
            />
          </div>
        </div>
      </dialog>
    </>
  );
};

export default QuestionModal;
