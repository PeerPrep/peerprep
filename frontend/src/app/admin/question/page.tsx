"use client";

import Button from "@/app/components/button/Button";
import { Input, Table, message } from "antd";
import { useState } from "react";

import { fetchAllQuestionsUrl, fetchQuestionDescriptionUrl } from "@/app/api";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import AddQuestionModal from "@/app/components/modal/AddQuestionModal";

export interface QuestionType {
  _id: string;
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
  const [currQnId, setCurrQnId] = useState<string | null>(null);

  const onClickModal = (modalId: string) => {
    if (document) {
      (document.getElementById(modalId) as HTMLFormElement).showModal();
    }
  };

  const columns: any = [
    {
      title: "Question",
      dataIndex: "title",
      width: 200,
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      width: 20,
      sorter: (a: QuestionType, b: QuestionType) => a.difficulty < b.difficulty,
      align: "center",
      render: (difficulty: string) => {
        if (!difficulty) {
          return null;
        }
        let color = difficulty.length > 5 ? "geekblue" : "green";
        switch (difficulty.toLowerCase()) {
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

        return (
          <div
            className={`inline-block rounded-full border border-white px-4 py-1 ${color} text-sm font-semibold`}
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
      width: 125,
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => {
            return (
              <div
                key={tag}
                className={`m-1 inline-block rounded-full border border-white bg-accent px-2 py-1 text-xs font-semibold`}
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
      width: 10,
      render: (text: string, record: QuestionType, index: number) => (
        <div className="flex justify-center gap-2">
          <EditOutlined className="border-1 p-2 text-xl hover:rounded-full hover:bg-primary-focus" />
          <DeleteOutlined className="p-2 text-xl hover:rounded-full hover:bg-primary-focus" />
          <EyeOutlined
            className="p-2 text-xl hover:rounded-full hover:bg-primary-focus"
            onClick={() => {
              console.log({ record });
              onClickModal("my_modal_2");
              setCurrQnId(record._id);
            }}
          />
        </div>
      ),
    },
  ];

  const { data: questionObj, isLoading: questionDescriptionLoading } = useQuery<
    { payload: QuestionType } | undefined
  >(["question", currQnId], () => {
    if (currQnId) {
      return fetchQuestionDescriptionUrl(currQnId);
    }
  });

  const { data: allQuestions, isLoading: allQuestionsLoading } =
    useQuery<FetchQuestionResponse>(["questions"], () => {
      return fetchAllQuestionsUrl();
    });

  return (
    <>
      <section className="flex flex-col gap-4 p-12">
        <div className="mx-auto flex w-[90svw] flex-col gap-4 lg:w-[70svw]">
          <div className="flex flex-row justify-between">
            <h1 className="text-5xl font-bold text-white underline">
              All Questions
            </h1>
            <div>
              <div className="flex flex-row items-center gap-4">
                <AddQuestionModal />
                <Button className="btn-primary btn-sm h-5 w-24 rounded-3xl">
                  Filter
                </Button>
                <Input
                  className="ml-3 h-10 w-64 rounded-3xl"
                  prefix={<SearchOutlined className="bg-white" />}
                  placeholder="Search"
                />
              </div>
            </div>
          </div>
          <dialog id="my_modal_2" className="modal">
            <div className=" modal-box max-w-4xl p-6">
              <form method="dialog" className="pb">
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <ReactMarkdown className="prose min-w-[40svh] max-w-none rounded-b-md bg-secondary p-6">
                {questionObj?.payload?.description ?? ""}
              </ReactMarkdown>
            </div>
          </dialog>

          <Table
            bordered
            columns={columns}
            dataSource={allQuestions?.payload}
          />
        </div>
      </section>
    </>
  );
};

export default QuestionPage;
