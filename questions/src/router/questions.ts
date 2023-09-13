import { createQuestion, getQuestion } from "../controllers/questions";
import express from "express";

export default (router: express.Router) => {
  router.get("/questions/:id", getQuestion);
  router.post("/questions", createQuestion);
};
