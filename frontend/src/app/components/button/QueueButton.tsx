"use client";
import { useState } from "react";
import useAccurateInterval from "../../hooks/useAccurateInterval";
import Button from "./Button";
import { RxCross1 } from "react-icons/rx";

const QueueButton = () => {
  const [time, setTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const handleClick = () => {
    setTime(0);
    setIsStarted((isStarted) => !isStarted);
  };

  //Handle when 15mins is reached!
  useAccurateInterval(
    () => setTime((time) => time + 1),
    isStarted ? 1500 : null,
  );

  function secondsToMinutesAndSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div>
      <Button
        className={`${isStarted ? "btn-accent" : "btn-success"} w-48`}
        onClick={handleClick}
        children={
          <>
            {isStarted ? (
              <div className="flex items-center justify-center gap-1">
                <RxCross1 className="text-md text-white" />
                <span>Queueing {secondsToMinutesAndSeconds(time)}</span>
              </div>
            ) : (
              <span>Find Partner</span>
            )}
          </>
        }
      />
    </div>
  );
};

export default QueueButton;
