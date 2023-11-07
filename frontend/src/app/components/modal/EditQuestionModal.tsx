import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { createQuestionUrl, updateQuestionUrl } from "@/app/api";
import topicsOptions from "@/app/admin/questionTypeData";
import { QuestionType } from "@/app/admin/question/page";

interface SelectOptionType {
  label: string;
  value: string;
}

const EditQuestionModal = ({
  question,
  successCallback,
}: {
  question?: QuestionType;
  successCallback: () => void;
}) => {
  const [selectedQnType, setSelectedQnType] = useState<
    MultiValue<SelectOptionType>
  >(question?.tags?.map((tag) => ({ value: tag, label: tag })) ?? []);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    question?.difficulty ?? "Easy",
  );
  const [api, contextHolder] = message.useMessage();

  // Please dont kill me for this
  useEffect(() => {
    setSelectedQnType(
      question?.tags?.map((tag) => ({ value: tag, label: tag })) ?? [],
    );
    setDifficulty(question?.difficulty ?? "Easy");
  }, [question]);

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

  const editQuestionMutation = useMutation(
    async (newQuestion: QuestionType) => updateQuestionUrl(newQuestion),
    {
      onSuccess: () => {
        closeModal("edit_modal");
        api.open({
          type: "success",
          content: "Successfully edited question!",
        });
        successCallback();
      },
      onError: (e) => {
        api.open({
          type: "error",
          content: "Failed to add question due to having same question name!",
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
      _id: question?._id ?? "",
      title: titleValue,
      difficulty: difficulty,
      tags: selectedTypes,
      description: e.currentTarget.description.value,
    };

    editQuestionMutation.mutate(submissionData);
  };

  return (
    <>
      {contextHolder}
      <section>
        <dialog
          id="edit_modal"
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
                  defaultValue={question?.title ?? ""}
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
                  defaultValue={question?.description ?? ""}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="reset"
                  onClick={() => closeModal("edit_modal")}
                  className="btn btn-error btn-sm text-white hover:bg-red-500"
                >
                  X Close
                </button>
                <button
                  type="submit"
                  className="btn btn-accent btn-sm text-white"
                >
                  + Edit
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </section>
    </>
  );
};

export default EditQuestionModal;
