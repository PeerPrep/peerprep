"use client";
import { atom } from "jotai";
import { QuestionType } from "../admin/question/page";
import { Profile } from "../hooks/useLogin";

export const firebaseTokenAtom = atom<string | null>(null);

export const FetchAuth = {
  firebaseToken: "",

  addFirebaseToken: function (firebaseToken: string) {
    this.firebaseToken = firebaseToken;
  },
  getFirebaseToken: async function (timeoutInMilliseconds: number = 100) {
    while (!this.firebaseToken) {
      await new Promise((resolve) =>
        setTimeout(resolve, timeoutInMilliseconds),
      );
    }

    return this.firebaseToken;
  },
  fetch: async function (
    url: RequestInfo | URL,
    options = { headers: {} } as RequestInit,
  ) {
    // Create a new Headers object with your custom headers
    const nonEmptyFirebaseToken = await this.getFirebaseToken();
    const headers = new Headers({
      "firebase-token": nonEmptyFirebaseToken,
      ...options.headers, // Optionally, include any headers from the options argument
    });

    // Add the headers to the options object
    options.headers = headers;

    // Perform the fetch request with the modified options
    const res = await fetch(url, options);
    if (!res.ok) {
      // console.log(res);
      // throw Error();
    }
    return res;
  },
};

export const QUESTIONS_API_URL = "http://localhost:4000/api/v1";
export const USERS_API_URL = "http://localhost:6969/api/v1";

export const fetchQuestionDescriptionUrl = async (qnId: string) => {
  return await fetch(`${QUESTIONS_API_URL}/questions/${qnId}`).then((res) =>
    res.json(),
  );
};

export const fetchAllQuestionsUrl = async () => {
  return await fetch(`${QUESTIONS_API_URL}/questions/`).then((res) =>
    res.json(),
  );
};

export const createQuestionUrl = async (newQuestion: QuestionType) => {
  return fetch(`${QUESTIONS_API_URL}/questions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuestion),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.statusMessage?.type?.toLowerCase() === "error") {
        throw Error();
      }
      return res;
    });
};

export const updateQuestionUrl = async (updatedQuestion: QuestionType) => {
  return fetch(`${QUESTIONS_API_URL}/questions/${updatedQuestion._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedQuestion),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.statusMessage?.type?.toLowerCase() === "error") {
        throw Error();
      }
      return res;
    });
};

export const deleteQuestionUrl = async (questionId: string) => {
  return fetch(`${QUESTIONS_API_URL}/questions/${questionId}`, {
    method: "DELETE",
  }).then((res) => res.json());
};

export const deleteProfileUrl = async () => {
  return FetchAuth.fetch(`${USERS_API_URL}/users/profile`, {
    method: "DELETE",
  }).then((res) => res.json());
};

interface ProfileResponse {
  payload: Profile;
  statusMessage: {
    type: "success" | "error";
    message: string;
  };
}

export async function fetchProfileUrl(): Promise<ProfileResponse> {
  return FetchAuth.fetch(`${USERS_API_URL}/users/profile`, { method: "GET" }).then(
    (res) => res.json(),
  );
}

export async function updateProfileUrl(
  name: string | null,
  preferredLang: string | null,
  profileImage: File | null,
): Promise<ProfileResponse> {
  const body = new FormData();
  if (name) body.set("name", name);
  if (preferredLang) body.set("preferredLang", preferredLang);
  if (profileImage) body.set("image", profileImage);
  return FetchAuth.fetch(`${USERS_API_URL}/users/profile`, {
    method: "POST",
    body,
  }).then((res) => res.json());
}
