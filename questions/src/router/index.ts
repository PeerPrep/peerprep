import express from "express";
import { questions } from "./questions";

const router = express.Router();

export const normalRouter = (): express.Router => {
  questions(router);
  return router;
};
