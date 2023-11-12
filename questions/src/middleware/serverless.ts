import express, { NextFunction } from "express";
import { StatusMessageType } from "../types";
import { handleCustomError, handleServerError } from "../utils";

const validatePasswordHeader = () => {
  return async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    const password = process.env.PASSWORD_HEADER;
    if (!password) {
      handleServerError(new Error("No password provided"), res);
      return;
    }

    const receivedPassword = req.headers["password-header"];

    if (receivedPassword != password) {
      console.dir(req.headers);
      handleCustomError(
        res,
        {
          type: StatusMessageType.ERROR,
          message: "No password provided",
        },
        401
      );
      return;
    }

    next();
    return;
  };
};

export default validatePasswordHeader;
