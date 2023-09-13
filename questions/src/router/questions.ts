import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  updateQuestion,
} from "../controllers/questions";

export default (router: express.Router) => {
  router.get("/questions/:id", getQuestion);
  router.post("/questions", createQuestion);
  router.put("/questions/:id", updateQuestion);
  router.delete("/questions/:id", deleteQuestion);
};
