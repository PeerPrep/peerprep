"use client";

import { useMemo, useState } from "react";
import Select, { MultiValue } from "react-select";
import topicsOptions from "../questionTypeData";
import Button from "@/app/components/button/Button";
import { Input, Table, message, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import {
  createQuestionUrl,
  fetchAllQuestionsUrl,
  fetchQuestionDescriptionUrl,
} from "@/app/api";
import { useMutation, useQuery } from "@tanstack/react-query";

interface SelectOptionType {
  label: string;
  value: string;
}

export interface QuestionType {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
}

interface FetchQuestionResponse {
  payload: QuestionType[];
  statusMessage: string;
}

const QuestionPage = () => {
  const [selectedQnType, setSelectedQnType] = useState<
    MultiValue<SelectOptionType>
  >([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );
  const [api, contextHolder] = message.useMessage();

  const [currQnId, setCurrQnId] = useState<number | null>(null);

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

  const createQuestionMutation = useMutation(
    async (newQuestion: QuestionType) => createQuestionUrl(newQuestion),
    {
      onSuccess: () => {
        closeModal("my_modal_1");
        api.open({
          type: "success",
          content: "Successfully added question!",
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

    console.log("Form Submission Data:", submissionData);
    createQuestionMutation.mutate(submissionData);
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "title",
      align: "center",
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      sorter: (a: QuestionType, b: QuestionType) => a.difficulty < b.difficulty,
      align: "center",
      render: (difficulty: string) => {
        if (!difficulty) {
          return null;
        }
        let color = difficulty.length > 5 ? "geekblue" : "green";
        switch (difficulty.toLowerCase()) {
          case "easy":
            color = "green";
            break;
          case "medium":
            color = "orange";
            break;
          case "hard":
            color = "red";
            break;
        }

        return (
          <div
            className={`inline-block px-2 py-1 text-xs font-semibold text-${color}-900 bg-${color}-300 rounded-full`}
          >
            {difficulty.toUpperCase()}
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "tags",
      sortDirections: ["descend"],
      sorter: (a: QuestionType, b: QuestionType) => a.tags < b.tags,
      align: "center",
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => {
            return (
              <div
                key={tag}
                className={`inline-block rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold`}
              >
                {tag.toUpperCase()}
              </div>
            );
          })}
        </>
      ),
    },
    // {
    //   title: "Language",
    //   dataIndex: "language",
    //   sortDirections: ["descend"],
    //   sorter: (a, b) => a.language - b.language,
    //   align: "center",
    // },
    // {
    //   title: "History",
    //   dataIndex: "history",
    //   sortDirections: ["descend"],
    //   sorter: (a, b) => a.history - b.history,
    //   align: "center",
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "center",
      render: (text: string, _: never, index: number) => (
        <div className="flex flex-row justify-around">
          <EditOutlined />
          <DeleteOutlined />
          <EyeOutlined
            onClick={() => {
              onClickModal("my_modal_2");
              setCurrQnId(index);
            }}
          />
        </div>
      ),
    },
  ];

  // TODO: Add API call to get question description based on currQnId using tanstack
  const {
    data: questionDescription,
    error,
    isLoading: questionDescriptionLoading,
  } = useQuery(["question", currQnId], () => {
    if (currQnId) {
      return fetchQuestionDescriptionUrl(currQnId);
    }
  });

  const { data: allQuestions, isLoading: allQuestionsLoading } =
    useQuery<FetchQuestionResponse>(["questions"], () => {
      return fetchAllQuestionsUrl();
    });

  const data = [
    {
      key: "1",
      question: "John Brown",
      date: 32,
      duration: "New York No. 1 Lake Park",
      language: "English",
      history: "English",
    },
    {
      key: "2",
      question: "Jim Green",
      date: 42,
      duration: "London No. 1 Lake Park",
      language: "English",
      history: "English",
    },
    {
      key: "3",
      question: "Joe Black",
      date: 32,
      duration: "Sidney No. 1 Lake Park",
      language: "English",
      history: "English",
    },
  ];

  return (
    <>
      {contextHolder}
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
      <section className=" p-10">
        <div className="flex flex-row justify-between">
          <h1 className="text-xl font-bold text-white underline">
            All Questions
          </h1>

          <div>
            <div className="flex flex-row items-center">
              <Button className="h-10 w-36 rounded-3xl">Filter</Button>
              <Input
                className="ml-3 h-10 w-64 rounded-3xl"
                prefix={<SearchOutlined className="bg-white" />}
                placeholder="Search"
              />
            </div>
          </div>
        </div>
        <dialog
          id="my_modal_2"
          className="modal"
          onKeyDown={(e) => onEscKeyDown(e)}
        >
          <div className="modal-box p-6">
            <ReactMarkdown className="prose h-[40svh] min-w-[90svw] overflow-y-scroll rounded-b-md bg-secondary p-6 lg:h-[80svh] lg:min-w-[45svw]">
              {questionDescription ?? ""}
            </ReactMarkdown>
          </div>
        </dialog>

        <Table
          className="p-4"
          columns={columns}
          dataSource={allQuestions?.payload}
        />
      </section>
    </>
  );
};

export default QuestionPage;
