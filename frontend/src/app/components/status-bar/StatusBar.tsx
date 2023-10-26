import { executeCode } from "@/app/api";
import { UserState } from "@/libs/innkeeper-api-types";
import {
  codeLangAtom,
  codeMirrorValueAtom,
  resultAtom,
  userStatesAtom,
} from "@/libs/room-jotai";
import { atom, useAtomValue, useSetAtom } from "jotai";
import Button from "../button/Button";
import UserStateBadge from "./UserStatusBadge";

interface StatusBarProps {
  exitMethod: () => void;
}

const triggerExecutionAtom = atom(null, async (get, set) => {
  const code = get(codeMirrorValueAtom);
  const codeLang = get(codeLangAtom);
  const result = await executeCode(code, codeLang);
  set(resultAtom, result);
});

const StatusBar = ({ exitMethod }: StatusBarProps) => {
  const code = useAtomValue(codeMirrorValueAtom);
  const userStates = useAtomValue(userStatesAtom);
  const callExecution = useSetAtom(triggerExecutionAtom);

  return (
    <footer className="fixed bottom-0 left-0 flex w-[100svw] items-center justify-between border-black bg-primary px-4 py-2 shadow-sm lg:static lg:w-full lg:px-12">
      <div className="flex gap-4">
        {userStates &&
          userStates.map((userState: UserState) => (
            <UserStateBadge userState={userState} />
          ))}
      </div>
      <div className="flex items-center gap-4">
        <Button
          className="btn-sm"
          onClick={callExecution}
          children={<span>Execute</span>}
        />
        <Button
          className="btn-error btn-sm"
          onClick={exitMethod}
          children={<span>Exit</span>}
        />
      </div>
    </footer>
  );
};

export default StatusBar;
