import express from "express";
import { questions, serverlessQuestions } from "./questions";

const router = express.Router();

export const normalRouter = (): express.Router => {
  questions(router);
  return router;
};
