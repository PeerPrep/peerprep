import express from "express";
import { QuestionDao } from "../models/questions";
import { ApiResponse, EMPTY_OBJECT, StatusMessageType } from "../types";
import { handleCustomError, handleServerError } from "../utils";

// GET /questions/:id
export const getQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    if (!id) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question ID must be provided",
      });
    }

    const question = await QuestionDao.getQuestionById(id);
    if (!question) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question not found",
      });
    }

    const response: ApiResponse = {
      payload: question,
      statusMessage: null,
    };
    res.status(200).json(response);
  } catch (error) {
    handleServerError(error, res);
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
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Title and description must be provided",
      });
    }

    const question = await QuestionDao.createQuestion(title, description);
    const response: ApiResponse = {
      payload: question,
      statusMessage: {
        type: StatusMessageType.SUCCESS,
        message: "Question created successfully",
      },
    };
    res.status(201).json(response);
  } catch (error) {
    handleServerError(error, res);
  }
};

// PUT /questions/:id
export const updateQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    if (!id || !title || !description) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question ID, title, and description must be provided",
      });
    }

    const question = await QuestionDao.updateQuestion(id, title, description);
    if (!question) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question not found",
      });
    }

    const response: ApiResponse = {
      payload: question,
      statusMessage: {
        type: StatusMessageType.SUCCESS,
        message: "Question updated successfully",
      },
    };
    res.status(200).json(response);
  } catch (error) {
    handleServerError(error, res);
  }
};

// DELETE /questions/:id
export const deleteQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    if (!id) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question ID must be provided",
      });
    }

    const question = await QuestionDao.deleteQuestion(id);
    if (!question) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question not found",
      });
    }

    const response: ApiResponse = {
      payload: question,
      statusMessage: {
        type: StatusMessageType.SUCCESS,
        message: "Question deleted successfully",
      },
    };
    res.status(200).json(response);
  } catch (error) {
    handleServerError(error, res);
  }
};
