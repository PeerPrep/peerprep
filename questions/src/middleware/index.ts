import express from "express";
import { NextFunction } from "express";
import { Auth } from "firebase-admin/auth";
import { handleCustomError, handleServerError } from "../utils";
import { StatusMessageType } from "../types";

const getFirebaseMiddleware = (firebaseAuth: Auth) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      if (req.method === "GET") {
        next();
        return;
      }

      const firebaseToken = req.get("firebase-token");
      if (!firebaseToken) {
        handleCustomError(res, {
          type: StatusMessageType.ERROR,
          message: "No Firebase token provided",
        });
        return;
      }

      await firebaseAuth.verifyIdToken(firebaseToken);
      next();
    } catch (err: any) {
      handleServerError(err, res);
    }
  };
};

export default getFirebaseMiddleware;
