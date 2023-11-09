"use client";

import Button from "@/app/components/button/Button";
import { useMemo, useState } from "react";
import { auth } from "@/libs/firebase-config";
import Select, { MultiValue } from "react-select";
import Skeleton from "react-loading-skeleton";

import {
  deleteQuestionUrl,
  fetchAllQuestionsUrl,
  fetchQuestionDescriptionUrl,
} from "@/app/api";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import AddQuestionModal, {
  SelectOptionType,
} from "@/app/components/modal/AddQuestionModal";
import dynamic from "next/dynamic";
import { Input, message } from "antd";
import EditQuestionModal from "@/app/components/modal/EditQuestionModal";
import topicsOptions from "../questionTypeData";
import { onAuthStateChanged } from "firebase/auth";
import useLogin from "@/app/hooks/useLogin";
import { useRouter } from "next/navigation";
import useAdmin from "@/app/hooks/useAdmin";
import LoadingPage from "@/app/loading";

export interface QuestionType {
  _id?: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
}

interface FetchQuestionResponse {
  payload: QuestionType[];
  statusMessage: string;
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
  const { isAdmin, isLoading } = useAdmin();

  const user = useLogin();
  const [api, contextHolder] = message.useMessage();
  const [currQn, setCurrQn] = useState<QuestionType | null>(null);
  const [initialEditQnValues, setInitialEditQnValues] = useState<
    QuestionType | undefined
  >();

  const onClickModal = (modalId: string) => {
    if (document) {
      (document.getElementById(modalId) as HTMLFormElement).showModal();
    }
  };

  const closeModal = (modalId: string) => {
    (document.getElementById(modalId) as HTMLFormElement).close();
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
      sorter: (a: QuestionType, b: QuestionType) => a.difficulty < b.difficulty,
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
      sortDirections: ["descend"],
      sorter: (a: QuestionType, b: QuestionType) => a.tags < b.tags,
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
              onClickModal("delete_modal");
              setCurrQn(record);
            }}
          />
          <EyeOutlined
            className="p-2 text-xl hover:cursor-pointer hover:rounded-full hover:bg-primary-focus"
            onClick={() => {
              onClickModal("my_modal_2");
              setCurrQn(record);
            }}
          />
        </div>
      ),
    },
  ];

  const { data: questionObj, isLoading: questionDescriptionLoading } = useQuery<
    { payload: QuestionType } | undefined
  >(["question", currQn], () => {
    if (currQn) {
      return fetchQuestionDescriptionUrl(currQn?._id ?? "");
    }
  });

  const {
    data: allQuestions,
    isLoading: allQuestionsLoading,
    refetch: refetchAllQuestions,
  } = useQuery<FetchQuestionResponse>(["questions"], () => {
    return fetchAllQuestionsUrl();
  });

  const [filterQnType, setFilterQnType] = useState<
    MultiValue<SelectOptionType>
  >([]);
  const [searchValue, setSearchValue] = useState("");

  onAuthStateChanged(auth, (_) => {
    refetchAllQuestions();
  });

  const allQuestionsFiltered = useMemo(() => {
    if (Array.isArray(allQuestions?.payload)) {
      return allQuestions?.payload.filter((question) => {
        return (
          question.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          question.tags.some((tag) =>
            tag.toLowerCase().includes(searchValue.toLowerCase()),
          ) ||
          question.difficulty.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
    }
  }, [allQuestions?.payload, searchValue, filterQnType]);

  const deleteQuestionMutation = useMutation(
    async (questionId: string) => deleteQuestionUrl(questionId),
    {
      onSuccess: () => {
        refetchAllQuestions();
        closeModal("delete_modal");
        api.open({
          type: "success",
          content: "Successfully deleted question!",
        });
      },
    },
  );

  const handleSelectChange = (
    selectedOptions: MultiValue<SelectOptionType>,
  ) => {
    setFilterQnType(selectedOptions);
  };

  const FilterPage = () => {
    return (
      <>
        <label
          htmlFor="questionType"
          className="mb-2 block font-medium text-white"
        >
          Question Type
        </label>
        {/* TODO: fix bug that closes the dropdown when you click outside the dropdown */}
        <div>
          <Select
            instanceId="question-type-selector"
            isMulti
            required
            value={filterQnType}
            onChange={handleSelectChange}
            name="question type"
            options={topicsOptions}
            className="basic-multi-select text-black"
            classNamePrefix="select"
          />
        </div>
      </>
    );
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center">
          <h1 className="text-6xl text-white">401</h1>
          <div className="divider divider-horizontal h-24"></div>
          <h2 className="text-xl text-white">Unauthorized</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <EditQuestionModal
        question={initialEditQnValues}
        successCallback={refetchAllQuestions}
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
                <AddQuestionModal successCallback={refetchAllQuestions} />
                <div className="dropdown">
                  <div
                    className="menu dropdown-content rounded-box z-[1] h-52 w-52 bg-base-100 p-2 shadow"
                    tabIndex={0}
                  >
                    <FilterPage />
                  </div>
                </div>
                <Input
                  className="ml-3 h-10 w-64 rounded-3xl"
                  prefix={<SearchOutlined className="bg-white" />}
                  placeholder="Search"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
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
                {questionObj?.payload?.description ?? ""}
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
                    deleteQuestionMutation.mutate(currQn?._id ?? "");
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
              dataSource={allQuestionsFiltered}
              pagination={{ position: ["bottomCenter"] }}
            />
            {allQuestionsLoading && (
              <Skeleton
                className="w-[90svw] lg:w-[70svw]"
                baseColor="#383D4B"
                highlightColor="#22242D"
                height="2rem"
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default QuestionPage;
