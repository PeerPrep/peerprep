import { useState } from "react";

interface ResultsTabProps {
  result?: string;
  isLoading?: boolean;
  height: number;
}
const ResultsTab = ({ result, isLoading = false, height }: ResultsTabProps) => {
  const [currentTab, setCurrentTab] = useState(1);
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
              <article className="w-full bg-black p-4 text-sm">
                Output: {result}
              </article>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ResultsTab;
