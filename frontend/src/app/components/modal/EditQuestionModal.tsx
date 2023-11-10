import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { message } from "antd";
import topicsOptions from "@/app/types/questionTypeData";
import { QuestionType } from "@/app/page";
import PreviewModalButton from "./PreviewModalButton";

interface SelectOptionType {
  label: string;
  value: string;
}

const EditQuestionModal = ({
  question,
  allQuestions,
  setAllQuestions,
}: {
  question?: QuestionType;
  allQuestions: QuestionType[];
  setAllQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>;
}) => {
  const [selectedQnType, setSelectedQnType] = useState<
    MultiValue<SelectOptionType>
  >(question?.tags?.map((tag) => ({ value: tag, label: tag })) ?? []);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    question?.difficulty ?? "Easy",
  );
  const [api, contextHolder] = message.useMessage();
  const [description, setDescription] = useState<string>(
    question?.description ?? "",
  );

  useEffect(() => {
    setSelectedQnType(
      question?.tags?.map((tag) => ({ value: tag, label: tag })) ?? [],
    );
    setDifficulty(question?.difficulty ?? "Easy");
    setDescription(question?.description ?? "");
  }, [question]);

  const closeModal = (modalId: string) => {
    (document.getElementById(modalId) as HTMLFormElement).close();
    setSelectedQnType(
      question?.tags?.map((tag) => ({ value: tag, label: tag })) ?? [],
    );
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
      _id: question?._id ?? "",
      title: titleValue,
      difficulty: difficulty,
      tags: selectedTypes,
      description: e.currentTarget.description.value,
    };

    // Check if a question with the same title already exists
    const existingQuestion = allQuestions.find(
      (q) => q.title === submissionData.title && q._id !== submissionData._id,
    );

    if (existingQuestion) {
      api.open({
        type: "error",
        content: "A question with the same name already exists!",
      });
    } else {
      // Update the edited question in the list of all questions
      const updatedQuestions = allQuestions.map((q) =>
        q._id === submissionData._id ? submissionData : q,
      );

      // Save the updated questions to localStorage
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));

      // Update the state with the new questions data
      setAllQuestions(updatedQuestions);

      // Notify success and close the modal
      api.open({
        type: "success",
        content: "Successfully edited question!",
      });

      closeModal("edit_modal");
    }
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
                <div className="flex items-end justify-center py-4">
                  <label
                    htmlFor="description"
                    className="block font-medium text-white"
                  >
                    Description
                  </label>
                  <PreviewModalButton
                    id={"edit_preview_modal"}
                    isDisabled={description.length === 0}
                    content={description}
                    className={`ml-auto inline`}
                  />
                </div>
                <textarea
                  required
                  id="description"
                  name="description"
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
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
