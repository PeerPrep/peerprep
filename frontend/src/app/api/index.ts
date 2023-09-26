import { QuestionType } from "../admin/question/page";

// TODO: change to env variable
export const API_URL = "https://peerprep.sivarn.com/api/v1";

export const fetchQuestionDescriptionUrl = async (qnId: string) => {
  return await fetch(`${API_URL}/questions/${qnId}`).then((res) => res.json());
};

export const fetchAllQuestionsUrl = async () => {
  return await fetch(`${API_URL}/questions/`).then((res) => res.json());
};

export const createQuestionUrl = async (newQuestion: QuestionType) => {
  return fetch(`${API_URL}/questions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuestion),
  }).then((res) => res.json());
};

export const updateQuestionUrl = async (updatedQuestion: QuestionType) => {
  return fetch(`${API_URL}/questions/${updatedQuestion._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedQuestion),
  }).then((res) => res.json());
};

export const deleteQuestionUrl = async (questionId: string) => {
  return fetch(`${API_URL}/questions/${questionId}`, {
    method: "DELETE",
  }).then((res) => res.json());
};
