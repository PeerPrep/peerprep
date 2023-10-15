"use client";
import { useState } from "react";
import QueueButton from "../components/button/QueueButton";
import Loading from "../loading";

const MatchingPage = () => {
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );
  return (
    <main className="flex h-full items-center justify-center">
      <section>
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
