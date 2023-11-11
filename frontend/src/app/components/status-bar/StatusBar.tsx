import Button from "../button/Button";

interface StatusBarProps {
  exitMethod: () => void;
  changeQuestion: () => void;
}

const StatusBar = ({ exitMethod, changeQuestion }: StatusBarProps) => {
  return (
    <footer className="fixed bottom-0 left-0 flex w-[100svw] items-center justify-between border-black bg-primary px-4 py-2 shadow-sm lg:w-full lg:px-12">
      <div className="flex gap-4"></div>
      <div className="flex items-center gap-4">
        <Button
          className="btn-outline btn-sm"
          onClick={changeQuestion}
          children={<span>Change Question</span>}
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
