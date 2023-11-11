import express from "express";
import { questions, serverlessQuestions } from "./questions";

const router = express.Router();

export const normalRouter = (): express.Router => {
  questions(router);
  return router;
};

export const serverlessRouter = (): express.Router => {
  serverlessQuestions(router);
  return router;
};
