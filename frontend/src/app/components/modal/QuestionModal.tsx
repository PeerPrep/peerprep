"use client";
import Select, { SingleValue } from "react-select";
import PreviewModalButton from "./PreviewModalButton";
import { useState } from "react";

interface QuestionModalProps {
  hasSessionInit?: boolean;
  onClick?: () => void;
  interviewDifficulty?: "Easy" | "Medium" | "Hard";
}
//TODO: change to question Type
interface SelectedOptionType {
  label: string;
  value: string;
}

const QuestionModal = ({
  hasSessionInit = false,
  onClick,
  interviewDifficulty = "Easy",
}: QuestionModalProps) => {
  //TODO: fetch all questions
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  let color;

  const [isOpen, setIsOpen] = useState(!hasSessionInit);

  switch (interviewDifficulty) {
    case "Easy":
      color = "bg-success text-white";
      break;
    case "Medium":
      color = "bg-warning text-white";
      break;
    case "Hard":
      color = "bg-error text-white";
      break;
  }

  const [selectedQn, setSelectedQn] =
    useState<SingleValue<SelectedOptionType>>();

  const handleSelectChange = (
    selectedOption: SingleValue<SelectedOptionType>,
  ) => {
    setSelectedQn(selectedOption);
  };

  const onClickStart = () => {
    // onClick();
    setIsOpen(false);
    console.log("hi");
  };

  return (
    <>
      <input type="checkbox" checked={isOpen} className="modal-toggle" />
      <dialog id="question-modal" className="modal">
        <div className="modal-box flex h-96 min-w-[40svw] flex-col gap-6 bg-secondary p-0">
          <h1 className="bg-primary p-4 text-4xl font-bold text-white">
            You are the Interviewer
          </h1>
          <h2 className="text-semibold flex items-center justify-center text-2xl text-white">
            Interview Difficulty:
            {
              <span
                className={`ml-4 rounded-md uppercase ${color} p-2 px-4 text-white shadow-md`}
              >
                {interviewDifficulty}
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
          <div className="flex items-center justify-end">
            <PreviewModalButton
              content="Hello World"
              isDisabled={selectedQn === undefined}
              className="inline"
            />
            <span className="modal-action mt-0 inline p-4">
              <button
                type="reset"
                onClick={onClickStart}
                disabled={selectedQn === undefined}
                className="btn btn-success btn-sm rounded-full text-white disabled:bg-slate-600 disabled:text-slate-700"
              >
                Begin!
              </button>
            </span>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default QuestionModal;
