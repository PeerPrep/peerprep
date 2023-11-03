"use client";
import { useState } from "react";
import useAccurateInterval from "../../hooks/useAccurateInterval";
import Button from "./Button";
import { RxCross1 } from "react-icons/rx";
import { innkeeperWriteAtom, isQueuingAtom } from "@/libs/room-jotai";
import { atom, useAtom, useSetAtom } from "jotai";
import { notification } from "antd";

interface QueueButtonProps {
  enterQueue: () => void;
  selectedDifficulty: "EASY" | "MEDIUM" | "HARD";
}

const triggerLeaveQueueAtom = atom(null, (get, set) => {
  set(innkeeperWriteAtom, {
    eventName: "leaveQueue",
    eventArgs: [],
  });
});

const QueueButton = ({ enterQueue, selectedDifficulty }: QueueButtonProps) => {
  const [time, setTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [_, handleLeaveQueue] = useAtom(triggerLeaveQueueAtom);
  const setIsQueueing = useSetAtom(isQueuingAtom);

  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.error({
      message: `Match not Found`,
      description: (
        <span>
          There appears to be no match for <b>{selectedDifficulty}</b> at this
          time. Please try again later or with another difficulty.
        </span>
      ),
      placement: "top",
    });
  };

  const handleClick = () => {
    setTime(0);
    if (isStarted) {
      handleLeaveQueue();
      setIsQueueing(false);
    } else {
      enterQueue();
    }
    setIsStarted((isStarted) => !isStarted);
  };

  useAccurateInterval(
    () => {
      //Set time out to 30s
      if (time !== 30) {
        setTime((time) => time + 1);
      } else {
        handleLeaveQueue();
        setIsStarted(false);
        setIsQueueing(false);
        openNotification();
      }
    },
    isStarted ? 1000 : null,
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
      {contextHolder}
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
