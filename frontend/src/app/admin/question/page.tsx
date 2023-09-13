"use client";

import { useState } from "react";
import Select, { MultiValue } from "react-select";
import topicsOptions from "../questionTypeData";

interface SelectOptionType {
  label: string;
  value: string;
}

const QuestionPage = () => {
  const [selectedQnType, setSelectedQnType] = useState<
    MultiValue<SelectOptionType>
  >([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );

  const onClickModal = (modalId: string) => {
    if (document) {
      (document.getElementById(modalId) as HTMLFormElement).showModal();
    }
  };
  const closeModal = (modalId: string) => {
    (document.getElementById(modalId) as HTMLFormElement).close();
    setSelectedQnType([]);
  };

  const handleSelectChange = (
    selectedOptions: MultiValue<SelectOptionType>,
  ) => {
    setSelectedQnType(selectedOptions);
  };

  const onEscKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key == "Escape" || e.key === "Esc") {
      e.preventDefault();
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Map selected options from Select component to values
    const selectedTypes = selectedQnType.map((option) => option.value);
    const formElements = e.currentTarget.elements as HTMLFormControlsCollection;
    const titleValue =
      (formElements.namedItem("title") as HTMLInputElement)?.value || "";

    const submissionData = {
      title: titleValue,
      difficulty: difficulty,
      questionType: selectedTypes,
      description: e.currentTarget.description.value,
    };

    console.log("Form Submission Data:", submissionData);
  };

  return (
    <section>
      <button
        className="btn btn-success text-white"
        onClick={() => onClickModal("my_modal_1")}
      >
        Add Question
      </button>
      <dialog
        id="my_modal_1"
        className="modal"
        onKeyDown={(e) => onEscKeyDown(e)}
      >
        <div className="modal-box p-6">
          <form
            id="question-form"
            className="flex flex-col gap-6"
            onSubmit={onSubmit}
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block font-medium text-white"
              >
                Title
              </label>
              <input
                required
                type="text"
                id="title"
                name="title"
                className="block w-full rounded-md border-gray-300 p-2 text-primary shadow-sm focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-accent"
              />
            </div>
            <div>
              <label
                htmlFor="difficulty"
                className="mb-2 block font-medium text-white"
              >
                Difficulty
              </label>
              <div className="join">
                <button
                  type="button"
                  className={`btn btn-primary join-item text-white ${
                    difficulty == "Easy" && "btn-success"
                  }`}
                  onClick={() => setDifficulty("Easy")}
                >
                  Easy
                </button>
                <button
                  type="button"
                  className={`btn btn-primary join-item text-white ${
                    difficulty == "Medium" && "btn-warning"
                  }`}
                  onClick={() => setDifficulty("Medium")}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`btn btn-primary join-item text-white ${
                    difficulty == "Hard" && "btn-error"
                  }`}
                  onClick={() => setDifficulty("Hard")}
                >
                  Hard
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="questionType"
                className="mb-2 block font-medium text-white"
              >
                Question Type
              </label>
              <Select
                instanceId="question-type-selector"
                isMulti
                required
                value={selectedQnType}
                onChange={handleSelectChange}
                name="question type"
                options={topicsOptions}
                className="basic-multi-select text-black"
                classNamePrefix="select"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="mb-2 block font-medium text-white"
              >
                Description
              </label>
              <textarea
                required
                id="description"
                name="description"
                rows={4}
                className="block w-full rounded-md border-gray-300 p-2 text-primary shadow-sm focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-accent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="reset"
                onClick={() => closeModal("my_modal_1")}
                className="btn btn-error btn-sm text-white hover:bg-red-500"
              >
                X Close
              </button>
              <button
                type="submit"
                className="btn btn-accent btn-sm text-white"
              >
                + Add
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </section>
  );
};

export default QuestionPage;
