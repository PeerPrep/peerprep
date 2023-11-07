import { useState } from "react";
import Select, { MultiValue } from "react-select";
import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { createQuestionUrl } from "@/app/api";
import topicsOptions from "@/app/admin/questionTypeData";
import Button from "../button/Button";
import { QuestionType } from "@/app/admin/question/page";
import PreviewModalButton from "./PreviewModalButton";

export interface SelectOptionType {
  label: string;
  value: string;
}

const AddQuestionModal = ({
  successCallback,
}: {
  successCallback: () => void;
}) => {
  const [selectedQnType, setSelectedQnType] = useState<
    MultiValue<SelectOptionType>
  >([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );

  const [description, setDescription] = useState("");
  const [api, contextHolder] = message.useMessage();

  const onClickModal = (modalId: string) => {
    if (document) {
      (document.getElementById(modalId) as HTMLFormElement).showModal();
    }
  };

  const setDefaultValues = () => {
    setDifficulty("Easy");
    setDescription("");
    setSelectedQnType([]);
  };

  const closeModal = (modalId: string) => {
    (document.getElementById(modalId) as HTMLFormElement).close();
    setDefaultValues();
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

  const createQuestionMutation = useMutation(
    async (newQuestion: QuestionType) => createQuestionUrl(newQuestion),
    {
      onSuccess: () => {
        api.open({
          type: "success",
          content: "Successfully added question!",
        });
        successCallback();
      },
      onError: (e) => {
        api.open({
          type: "error",
          content: "Failed to add question due to same name!",
        });
      },
    },
  );

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
      tags: selectedTypes,
      description: e.currentTarget.description.value,
    };

    createQuestionMutation && createQuestionMutation.mutate(submissionData);
    e.currentTarget.reset();
    setDefaultValues();
    closeModal("my_modal_1");
  };

  return (
    <>
      {contextHolder}
      <section>
        <Button
          className="btn btn-success btn-sm w-44 rounded-full text-white"
          onClick={() => onClickModal("my_modal_1")}
        >
          Add Question
        </Button>
        <dialog
          id="my_modal_1"
          className="modal"
          onKeyDown={(e) => onEscKeyDown(e)}
        >
          <div className="modal-box p-6">
            <form
              id="question-form"
              key="question-form"
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
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="mb-2 inline grow font-medium text-white"
                  >
                    Description
                  </label>
                  <PreviewModalButton
                    isDisabled={description.length == 0}
                    content={description}
                    className={`mx-auto inline`}
                  />
                </div>
                <textarea
                  required
                  id="description"
                  name="description"
                  onChange={(e) => setDescription(e.target.value)}
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
    </>
  );
};

export default AddQuestionModal;
