import { QuestionType } from "../admin/question/page";

export const FetchAuth = {
  firebaseToken: "",

  addFirebaseToken: function (firebaseToken: string) {
    this.firebaseToken = firebaseToken;
  },
  fetch: async function (
    url: RequestInfo | URL,
    options = { headers: {} } as RequestInit,
  ) {
    // Create a new Headers object with your custom headers
    while (!this.firebaseToken) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100 milliseconds
    }
    const headers = new Headers({
      "firebase-token": this.firebaseToken,
      ...options.headers, // Optionally, include any headers from the options argument
    });

    // Add the headers to the options object
    options.headers = headers;

    // Perform the fetch request with the modified options
    return fetch(url, options);
  },
};

// TODO: change to env variable
export const API_URL = "https://peerprep.sivarn.com/api/v1";

export const fetchQuestionDescriptionUrl = async (qnId: string) => {
  return await FetchAuth.fetch(`${API_URL}/questions/${qnId}`).then((res) =>
    res.json(),
  );
};

export const fetchAllQuestionsUrl = async () => {
  return await FetchAuth.fetch(`${API_URL}/questions/`).then((res) =>
    res.json(),
  );
};

export const createQuestionUrl = async (newQuestion: QuestionType) => {
  return FetchAuth.fetch(`${API_URL}/questions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newQuestion),
  }).then((res) => res.json());
};

export const updateQuestionUrl = async (updatedQuestion: QuestionType) => {
  return FetchAuth.fetch(`${API_URL}/questions/${updatedQuestion._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedQuestion),
  }).then((res) => res.json());
};

export const deleteQuestionUrl = async (questionId: string) => {
  return FetchAuth.fetch(`${API_URL}/questions/${questionId}`, {
    method: "DELETE",
  }).then((res) => res.json());
};
