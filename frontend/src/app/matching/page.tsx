"use client";
import { useState } from "react";
import QueueButton from "../components/button/QueueButton";
import Loading from "../loading";
import { QuestionType } from "../admin/question/page";

const MatchingPage = () => {
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
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

  return (
    <main className="flex h-full items-center justify-center">
      <section className="flex items-center">
        <QueueButton />
        <label>
          <span>Difficulty Setting:</span>
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
      </section>
    </main>
  );
};

export default MatchingPage;
