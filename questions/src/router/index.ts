import express from "express";
import { questions, serverlessQuestions } from "./questions";

export const normalRouter = (): express.Router => {
  questions(router);
  return router;
};

export const serverlessRouter = (): express.Router => {
  const router = express.Router();
  serverlessQuestions(router);
  return router;
};
