"use client";
import { atom } from "jotai";
import { useState } from "react";
import Button from "./Button";

interface QueueButtonProps {
  enterQueue: () => void;
  selectedDifficulty: "EASY" | "MEDIUM" | "HARD";
}

const QueueButton = ({ enterQueue, selectedDifficulty }: QueueButtonProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const handleClick = () => {
    setIsStarted(true);
    enterQueue();
  };

  return (
    <div>
      <Button
        className={`${isStarted ? "btn-accent" : "btn-success"} w-48`}
        onClick={handleClick}
        children={<span>Check out questions</span>}
      />
    </div>
  );
};

export default QueueButton;
