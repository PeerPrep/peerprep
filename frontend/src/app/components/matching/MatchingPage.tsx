"use client";
import { useState } from "react";
import QueueButton from "../button/QueueButton";
import { QuestionType } from "../../admin/question/page";
import { atom, useAtom } from "jotai";
import { innkeeperWriteAtom } from "@/libs/room-jotai";
import { fetchAllQuestionsDoneByUser } from "@/app/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, Table } from "antd";

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
  const sendMatchRequest: (
    questionDifficulty: "EASY" | "MEDIUM" | "HARD",
  ) => void = useAtom(sendMatchRequestAtom)[1];

  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "EASY",
  );
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
      dataIndex: "date",
      sortDirections: ["descend"],
      render: (date: string) => <>{date}</>,
    },
  ];

  const {
    data: allQuestions,
    isLoading: allQuestionsLoading,
    refetch: refetchAllQuestions,
  } = useQuery(["activityQuestions"], () => {
    return fetchAllQuestionsDoneByUser();
  });

  console.log({ allQuestions });

  return (
    <main className="flex h-full flex-col items-center justify-center">
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
            onClick={() => setDifficulty("EASY")}
          >
            Easy
          </button>
          <button
            type="button"
            className={`btn btn-primary join-item text-white ${
              difficulty == "MEDIUM" && "btn-warning"
            }`}
            onClick={() => setDifficulty("MEDIUM")}
          >
            Medium
          </button>
          <button
            type="button"
            className={`btn btn-primary join-item text-white ${
              difficulty == "HARD" && "btn-error"
            }`}
            onClick={() => setDifficulty("HARD")}
          >
            Hard
          </button>
        </div>
        <QueueButton enterQueue={() => sendMatchRequest(difficulty)} />
      </section>
      <div className="m-7">
        <h1 className="mb-2 block text-5xl font-bold text-white underline">
          Completed Questions
        </h1>
        <Table
          className="mt-4"
          bordered
          columns={activityTableColumns}
          dataSource={allQuestions}
          pagination={{ position: ["bottomCenter"] }}
        />
      </div>
    </main>
  );
};

export default MatchingPage;
