import { UserState } from "@/libs/innkeeper-api-types";
import Button from "../button/Button";
import UserStateBadge from "./UserStatusBadge";

interface StatusBarProps {
  executeFunction: () => void;
  exitMethod: () => void;
  user1State: Omit<UserState, "version">;
  user2State: Omit<UserState, "version">;
}

const StatusBar = ({
  executeFunction,
  exitMethod,
  user1State,
  user2State,
}: StatusBarProps) => {
  return (
    <footer className="fixed bottom-0 left-0 flex w-[100svw] items-center justify-between border-black bg-primary px-4 py-2 shadow-sm lg:static lg:w-full lg:px-12">
      <div className="flex gap-4">
        <UserStateBadge userState={user1State} />
        <UserStateBadge userState={user2State} />
      </div>
      <div className="flex items-center gap-4">
        <Button
          className="btn-sm"
          onClick={executeFunction}
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
