import express from "express";
import { QuestionDao } from "../models/questions";
import { ApiResponse, StatusMessageType } from "../types";
import { handleCustomError, handleServerError } from "../utils";

// GET /questions
export const getAllQuestions = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const questions = await QuestionDao.getAllQuestions();
    const response: ApiResponse = {
      payload: questions,
      statusMessage: null,
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    handleServerError(error, res);
    return;
  }
};

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
      return;
    }

    const question = await QuestionDao.getQuestionById(id);
    if (!question) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question not found",
      });
      return;
    }

    const response: ApiResponse = {
      payload: question,
      statusMessage: null,
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    handleServerError(error, res);
    return;
  }
};

// GET /questions/group/:ids
export const getQuestionsByGroupOfIds = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const ids = req.params.ids.split("-");
    if (!ids || ids.length === 0) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question IDs must be provided",
      });
      return;
    }

    const questions = await QuestionDao.getQuestionsByGroupOfIds(ids);
    if (!questions || questions.length === 0) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Questions not found",
      });
      return;
    }

    const response: ApiResponse = {
      payload: questions,
      statusMessage: null,
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    handleServerError(error, res);
    return;
  }
};

// POST /questions
export const createQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title, description, tags, difficulty } = req.body;
    if (!title || !description || !difficulty) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Title, description and difficulty must be provided",
      });
      return;
    }

    if (!tags || tags.length === 0) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "At least one tag must be provided",
      });
      return;
    }

    const question = await QuestionDao.createQuestion(
      title,
      description,
      tags,
      difficulty
    );
    const response: ApiResponse = {
      payload: question,
      statusMessage: {
        type: StatusMessageType.SUCCESS,
        message: "Question created successfully",
      },
    };
    res.status(201).json(response);
    return;
  } catch (error) {
    handleServerError(error, res);
    return;
  }
};

// PUT /questions/:id
export const updateQuestion = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    const { title, description, tags, difficulty } = req.body;
    if (!id || !title || !description || !difficulty) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message:
          "Question ID, title, description and difficulty must be provided",
      });
      return;
    }

    if (!tags || tags.length === 0) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "At least one tag must be provided",
      });
      return;
    }

    const question = await QuestionDao.updateQuestion(
      id,
      title,
      description,
      tags,
      difficulty
    );
    if (!question) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question not found",
      });
      return;
    }

    const response: ApiResponse = {
      payload: question,
      statusMessage: {
        type: StatusMessageType.SUCCESS,
        message: "Question updated successfully",
      },
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    handleServerError(error, res);
    return;
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
      return;
    }

    const question = await QuestionDao.deleteQuestion(id);
    if (!question) {
      handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Question not found",
      });
      return;
    }

    const response: ApiResponse = {
      payload: question,
      statusMessage: {
        type: StatusMessageType.SUCCESS,
        message: "Question deleted successfully",
      },
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    handleServerError(error, res);
    return;
  }
};
