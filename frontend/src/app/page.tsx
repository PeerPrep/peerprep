"use client";

import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddQuestionModal from "@/app/components/modal/AddQuestionModal";
import dynamic from "next/dynamic";
import { message } from "antd";
import EditQuestionModal from "@/app/components/modal/EditQuestionModal";

export interface QuestionType {
  _id?: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
}

const Table = dynamic(() => import("antd/lib").then((m) => m.Table), {
  ssr: false,
  loading: () => (
    <Skeleton
      width="70svw"
      count={15}
      baseColor="#383D4B"
      highlightColor="#22242D"
      height="2rem"
    />
  ),
});

const QuestionPage = () => {
  const [api, contextHolder] = message.useMessage();
  const [currQn, setCurrQn] = useState<QuestionType | null>(null);
  const [initialEditQnValues, setInitialEditQnValues] = useState<
    QuestionType | undefined
  >();

  const [allQuestions, setAllQuestions] = useState<QuestionType[]>([]);

  // Load data from local storage on component mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem("questions");
    console.log(savedQuestions);
    if (savedQuestions) {
      setAllQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  // Save data to local storage whenever allQuestions changes
  useEffect(() => {
    if (allQuestions.length > 0) {
      localStorage.setItem("questions", JSON.stringify(allQuestions));
    }
  }, [allQuestions]);

  const onClickModal = (modalId: string) => {
    if (document) {
      (document.getElementById(modalId) as HTMLFormElement).showModal();
    }
  };

  const closeModal = (modalId: string) => {
    (document.getElementById(modalId) as HTMLFormElement).close();
  };

  const handleDelete = (questionId: string) => {
    // Filter out the question with the specified _id
    const updatedQuestions = allQuestions.filter(
      (question) => question._id !== questionId,
    );

    // Save the updated questions to localStorage
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));

    // Update the state with the new questions data
    setAllQuestions(updatedQuestions);

    // Notify success
    api.open({
      type: "success",
      content: "Question deleted successfully!",
    });

    closeModal("delete_modal");
  };

  const columns: any = [
    {
      title: "Question",
      dataIndex: "title",
      width: 200,
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      width: 20,
      align: "center",
      render: (difficulty: string) => {
        if (!difficulty) {
          return null;
        }
        let color = difficulty.length > 5 ? "geekblue" : "green";
        switch (difficulty.toLowerCase()) {
          case "easy":
            color = "bg-success text-white";
            break;
          case "medium":
            color = "bg-warning text-white";
            break;
          case "hard":
            color = "bg-error text-white";
            break;
        }

        return (
          <div
            className={`inline-block rounded-full border border-white px-4 py-1 ${color} text-sm font-semibold`}
          >
            {difficulty.toUpperCase()}
          </div>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "tags",
      align: "center",
      width: 125,
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => {
            return (
              <div
                key={tag}
                className={`m-1 inline-block rounded-full border border-white bg-accent px-2 py-1 text-xs font-semibold`}
              >
                {tag.toUpperCase()}
              </div>
            );
          })}
        </>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      align: "center",
      width: 10,
      render: (text: string, record: QuestionType, index: number) => (
        <div className="flex justify-center gap-2">
          <EditOutlined
            className="border-1 p-2 text-xl hover:rounded-full hover:bg-primary-focus"
            onClick={() => {
              setInitialEditQnValues(record);
              onClickModal("edit_modal");
              // setCurrQn(record);
            }}
          />
          <DeleteOutlined
            className="p-2 text-xl hover:rounded-full hover:bg-primary-focus"
            onClick={() => {
              setCurrQn(record);
              onClickModal("delete_modal");
            }}
          />
          <EyeOutlined
            className="p-2 text-xl hover:cursor-pointer hover:rounded-full hover:bg-primary-focus"
            onClick={() => {
              setCurrQn(record);
              onClickModal("my_modal_2");
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <EditQuestionModal
        question={initialEditQnValues}
        setAllQuestions={setAllQuestions}
        allQuestions={allQuestions}
      />
      {contextHolder}
      <section className="flex flex-col gap-4 p-12">
        <div className="mx-auto flex w-[90svw] flex-col gap-4 lg:w-[70svw]">
          <div className="flex flex-row justify-between">
            <h1 className="text-5xl font-bold text-white underline">
              All Questions
            </h1>
            <div>
              <div className="flex flex-row items-center gap-4">
                <AddQuestionModal
                  allQuestions={allQuestions}
                  setAllQuestions={setAllQuestions}
                />
                <div className="dropdown">
                  <div
                    className="menu dropdown-content rounded-box z-[1] h-52 w-52 bg-base-100 p-2 shadow"
                    tabIndex={0}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box max-w-4xl p-6">
              <form method="dialog" className="pb">
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <ReactMarkdown className="prose min-w-[40svh] max-w-none rounded-b-md bg-secondary p-6">
                {currQn?.description ?? ""}
              </ReactMarkdown>
            </div>
          </dialog>
          <dialog id="delete_modal" className="modal">
            <div className="max-w-screen modal-box p-6">
              <form method="dialog" className="pb">
                <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h1>Are you sure you want to delete {currQn?.title ?? ""}?</h1>
              <div className="flex justify-end gap-2">
                <button
                  type="reset"
                  onClick={() => {
                    closeModal("delete_modal");
                  }}
                  className="btn btn-error btn-sm text-white hover:bg-red-500"
                >
                  No
                </button>
                <button
                  type="submit"
                  className="btn btn-accent btn-sm text-white"
                  onClick={() => {
                    handleDelete(currQn?._id ?? "");
                    closeModal("delete_modal");
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </dialog>

          <div>
            <Table
              bordered
              columns={columns}
              dataSource={allQuestions}
              pagination={{ position: ["bottomCenter"] }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default QuestionPage;
