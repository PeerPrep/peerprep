import { completeQuestion } from "@/app/api";
import { isQuestionModalOpenAtom, questionIdAtom } from "@/libs/room-jotai";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { message } from "antd";
import { useAtomValue, useSetAtom } from "jotai";
import Button from "../button/Button";

interface StatusBarProps {
  exitMethod: () => void;
}

const StatusBar = ({ exitMethod }: StatusBarProps) => {
  const questionId = useAtomValue(questionIdAtom);
  const setQuestionModalOpen = useSetAtom(isQuestionModalOpenAtom);
  const [api, contextHolder] = message.useMessage();

  const UiElementOnClose = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="mt-1 flex gap-2 rounded-full bg-error px-2 py-1 font-bold text-white">
          <ExclamationCircleFilled />
          Your room has been closed.
        </div>
        <Button
          className="btn-accent btn-sm"
          onClick={() => window.location.reload()}
        >
          Back to Matching
        </Button>
      </div>
    );
  };

  return (
    <footer className="fixed bottom-0 left-0 flex w-[100svw] items-center justify-between border-black bg-primary px-4 py-2 shadow-sm lg:w-full lg:px-12">
      {contextHolder}
      <div className="flex gap-4"></div>
      <div className="flex items-center gap-4">
        <Button
          className="btn-outline btn-sm"
          onClick={() =>
            questionId &&
            completeQuestion(questionId).then((res) =>
              res.statusMessage.type.toLowerCase() === "success"
                ? api.success({
                    type: "success",
                    content: "Successfully completed question!",
                  })
                : api.error({
                    type: "error",
                    content: "Failure completing question",
                  }),
            )
          }
          children={<span>Mark As Complete</span>}
          disabled={!questionId}
        />
        <Button
          className="btn-sm"
          disabled={true}
          children={<span>Execute</span>}
        />
        <Button
          className="btn-error btn-sm"
          onClick={exitMethod}
          children={<span>Select Difficulty</span>}
        />
      </div>
    </footer>
  );
};

export default StatusBar;
