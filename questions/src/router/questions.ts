import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  getQuestionsByGroupOfIds,
  updateQuestion,
} from "../controllers/questions";

export const questions = (router: express.Router) => {
  router.get("/questions", getAllQuestions);
  router.get("/questions/:id", getQuestion);
  router.get("/questions/group/:ids", getQuestionsByGroupOfIds);
  router.post("/questions", createQuestion);
  router.put("/questions/:id", updateQuestion);
  router.delete("/questions/:id", deleteQuestion);
};

export const serverlessQuestions = (router: express.Router) => {
  router.post("/questions", createQuestion);
};
