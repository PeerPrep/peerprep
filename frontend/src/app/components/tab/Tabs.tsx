import { FetchAuth } from "@/app/api";
import {
  chatHistoryAtom,
  innkeeperWriteAtom,
  resultAtom,
} from "@/libs/room-jotai";
import { getAuth } from "firebase/auth";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import Button from "../button/Button";

interface ResultsTabProps {
  isLoading?: boolean;
  height: number;
}

const triggerChatMessageRequestAtom = atom(
  null,
  (get, set, message: string) => {
    set(innkeeperWriteAtom, {
      eventName: "sendChatMessage",
      eventArgs: [message],
    });
  },
);

const userDetailsAtom = atom<string | null>(null);

const Tabs = ({ isLoading = false, height }: ResultsTabProps) => {
  const result = useAtomValue(resultAtom);
  const [currentTab, setCurrentTab] = useState(1);
  const sendMessage = useSetAtom(triggerChatMessageRequestAtom);
  const chatHistory = useAtomValue(chatHistoryAtom);
  const [message, setMessage] = useState("");
  const [uid, setUid] = useAtom(userDetailsAtom);
  useEffect(() => {
    FetchAuth.getFirebaseToken().then(() => {
      const uid = getAuth().currentUser?.uid ?? null;
      setUid(uid);
    });
  }, []);

  const onSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

  const isMessageEmpty = message == "" || message.trim() == "";

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!isMessageEmpty) {
        onSendMessage();
      }
    }
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
            {result && <pre className="w-full  p-4 text-sm">{result}</pre>}
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
                    message.user === uid ? "self-end" : "self-start"
                  } max-w-md`}
                >
                  <div
                    className={`${
                      message.user === uid ? "bg-accent" : "bg-primary"
                    } mx-2 rounded-lg p-2 text-white`}
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
                onKeyDown={(e) => handleKeyPress(e)}
              ></input>
              <Button
                isDisabled={isMessageEmpty}
                onClick={onSendMessage}
                className="btn-accent btn-sm"
              >
                Send
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Tabs;
