"use client";
import { useState } from "react";
import useAccurateInterval from "../../hooks/useAccurateInterval";
import Button from "./Button";
import { RxCross1 } from "react-icons/rx";
import { innkeeperWriteAtom } from "@/libs/room-jotai";
import { atom, useAtom, useSetAtom } from "jotai";

interface QueueButtonProps {
  enterQueue: () => void;
}

const triggerLeaveQueueAtom = atom(null, (get, set) => {
  set(innkeeperWriteAtom, {
    eventName: "leaveQueue",
    eventArgs: [],
  });
});

const QueueButton = ({ enterQueue }: QueueButtonProps) => {
  const [time, setTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [_, handleLeaveQueue] = useAtom(triggerLeaveQueueAtom);

  const handleClick = () => {
    setTime(0);
    if (isStarted) {
      handleLeaveQueue();
    } else {
      enterQueue();
    }
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
