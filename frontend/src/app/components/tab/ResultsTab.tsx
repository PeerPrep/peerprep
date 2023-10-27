import {
  chatHistoryAtom,
  innkeeperWriteAtom,
  resultAtom,
  roomStateAtom,
} from "@/libs/room-jotai";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import Button from "../button/Button";

interface ResultsTabProps {
  isLoading?: boolean;
  height: number;
}

type ChatMessage = {
  user: string;
  message: string;
};

const triggerChatMessageRequestAtom = atom(
  null,
  (get, set, message: string) => {
    set(innkeeperWriteAtom, {
      eventName: "sendChatMessage",
      eventArgs: [message],
    });
  },
);

const ResultsTab = ({ isLoading = false, height }: ResultsTabProps) => {
  const result = useAtomValue(resultAtom);
  const [currentTab, setCurrentTab] = useState(1);
  const sendMessage = useSetAtom(triggerChatMessageRequestAtom);
  const chatHistory = useAtomValue(chatHistoryAtom);
  const [message, setMessage] = useState("");

  const onSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="mb-2">
      <div>
        <nav className="w-[90svw] rounded-t-md bg-primary p-2 lg:w-[50svw]">
          <a
            className={`btn btn-primary btn-sm ${
              currentTab === 1 && "hover bg-primary-focus"
            }`}
            onClick={() => setCurrentTab(1)}
          >
            Results
          </a>
          <a
            className={`btn btn-primary btn-sm ${
              currentTab === 2 && "hover bg-primary-focus"
            }`}
            onClick={() => setCurrentTab(2)}
          >
            Chat
          </a>
        </nav>

        {currentTab == 1 && height > 40 && (
          <section
            style={{ height: `${height}px` }}
            className={`flex w-[90svw] ${
              !result && "items-center"
            } justify-center overflow-y-auto bg-secondary lg:w-[50svw]`}
          >
            {!result && <div>You must run the code first</div>}
            {result && (
              <article className="w-full  p-4 text-sm">
                Output: {result}
              </article>
            )}
          </section>
        )}
        {currentTab == 2 && height > 40 && (
          <section
            style={{ height: `${height}px` }}
            className={`flex w-[90svw] flex-col bg-secondary p-4 lg:w-[50svw]`}
          >
            <div className="flex grow flex-col gap-2 overflow-y-auto">
              {chatHistory?.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.user === "user_a" ? "self-end" : "self-start"
                  } max-w-md`}
                >
                  <div
                    className={`${
                      message.user === "user_a" ? "bg-accent" : "bg-primary"
                    } rounded-lg p-2 text-white`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                className="my-2 grow border-2 p-1 text-black"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              ></input>
              <Button onClick={onSendMessage} className="btn-accent btn-sm">
                Send
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResultsTab;
