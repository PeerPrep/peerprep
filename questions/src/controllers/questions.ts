import express from "express";
import { QuestionDao } from "../models/questions";
import { ApiResponse, EMPTY_OBJECT, StatusMessageType } from "../types";

// GET /questions/:id
export const getQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    if (!id) {
      const response: ApiResponse = {
        payload: EMPTY_OBJECT,
        statusMessage: {
          type: StatusMessageType.ERROR,
          message: "No ID provided",
        },
      };

      res.status(400).json(response);
    }

    const question = await QuestionDao.getQuestionById(id);
    if (!question) {
      const response: ApiResponse = {
        payload: EMPTY_OBJECT,
        statusMessage: {
          type: StatusMessageType.ERROR,
          message: "No question found",
        },
      };

      res.status(404).json(response);
    }

    const response: ApiResponse = {
      payload: question,
      statusMessage: null,
    };
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    const response: ApiResponse = {
      payload: EMPTY_OBJECT,
      statusMessage: {
        type: StatusMessageType.ERROR,
        message: "Something went wrong",
      },
    };

    res.status(500).json(response);
  }
};

// POST /questions
export const createQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      const response: ApiResponse = {
        payload: EMPTY_OBJECT,
        statusMessage: {
          type: StatusMessageType.ERROR,
          message: "Title or description must provided",
        },
      };

      res.status(400).json(response);
    }

    const question = await QuestionDao.createQuestion(title, description);
    const response: ApiResponse = {
      payload: question,
      statusMessage: null,
    };
    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    const response: ApiResponse = {
      payload: EMPTY_OBJECT,
      statusMessage: {
        type: StatusMessageType.ERROR,
        message: "Something went wrong",
      },
    };

    res.status(500).json(response);
  }
};
