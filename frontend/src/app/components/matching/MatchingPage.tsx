"use client";
import { useState } from "react";
import QueueButton from "../button/QueueButton";
import { QuestionType } from "../../admin/question/page";
import { atom, useAtom } from "jotai";
import { innkeeperWriteAtom, isQueuingAtom } from "@/libs/room-jotai";
import { fetchAllQuestionsDoneByUser } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, Table, notification } from "antd";
import { EyeOutlined } from "@ant-design/icons";
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
  const activityTableColumns: any = [
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
    {
      title: "Submitted Date",
      dataIndex: "submitted",
      sortDirections: ["descend"],
      render: (date: string) => {
        return new Date(date).toLocaleDateString();
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "center",
      width: 10,
      render: (text: string, record: QuestionType, index: number) => (
        <div className="flex justify-center gap-2">
          <EyeOutlined
            className="p-2 text-xl hover:cursor-pointer hover:rounded-full hover:bg-primary-focus"
            onClick={() => {
              onClickModal("my_modal_2");
              setCurrQn(record);
            }}
          />
        </div>
      ),
    },
  ];

  const onClickModal = (modalId: string) => {
    if (document) {
      (document.getElementById(modalId) as HTMLFormElement).showModal();
    }
  };

  const {
    data: allQuestions,
    isLoading: allQuestionsLoading,
    refetch: refetchAllQuestions,
  } = useQuery(["activityQuestions"], () => {
    return fetchAllQuestionsDoneByUser();
  });

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
        <div className="m-7">
          <h1 className="mb-2 block text-5xl font-bold text-white underline">
            Completed Questions
          </h1>
          <Table
            className="mt-4"
            bordered
            columns={activityTableColumns}
            dataSource={allQuestions as any}
            pagination={{ position: ["bottomCenter"] }}
          />
        </div>
      </main>
    </>
  );
};

export default MatchingPage;
