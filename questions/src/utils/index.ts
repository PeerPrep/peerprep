import express from "express";
import {
  ApiResponse,
  EMPTY_OBJECT,
  StatusMessage,
  StatusMessageType,
} from "../types";

export const handleCustomError = (
  res: express.Response,
  statusMessage: StatusMessage
) => {
  const response: ApiResponse = {
    payload: EMPTY_OBJECT,
    statusMessage,
  };

  res.status(400).json(response);
};

export const handleServerError = (error: Error, res: express.Response) => {
  console.log(error);

  const response: ApiResponse = {
    payload: EMPTY_OBJECT,
    statusMessage: {
      type: StatusMessageType.ERROR,
      message: error.message,
    },
  };

  res.status(500).json(response);
};
