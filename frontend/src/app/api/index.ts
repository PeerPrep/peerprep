import { User } from "firebase/auth";
import { QuestionType } from "../admin/question/page";
import { Profile } from "../hooks/useLogin";

// TODO: change to env variable
export const API_URL =  "http://localhost:6969/api/v1" //"https://peerprep.sivarn.com/api/v1";

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

interface ProfileResponse {
  payload: Profile;
  statusMessage: string;
};

export async function fetchProfileUrl(token: string): Promise<ProfileResponse> {
  console.log(`Token when fetchingProfileUrl: ${token}`);
  const headers = {
    'firebase-token': token
  };
  const req = new Request(`${API_URL}/users/profile`, { headers, method: "GET" });
  return fetch(req)
    .then((res) => res.json());
}

export async function updateProfileUrl(token: string,
                                       name: string | null,
                                       preferredLang: string | null,
                                       profileImage: File | null): Promise<ProfileResponse> {
  const headers = {
    'firebase-token': token
  };
  const body = new FormData();
  if (name) body.set("name", name);
  if (preferredLang) body.set("preferredLang", preferredLang);
  if (profileImage) body.set("image", profileImage);
  const req = new Request(`${API_URL}/users/profile`, { headers, method: "POST", body });
  return fetch(req)
    .then((res) => res.json());
}
