import express from "express";
import { NextFunction } from "express";
import { Auth } from "firebase-admin/auth";
import { handleCustomError, handleServerError } from "../utils";
import { StatusMessageType } from "../types";
import axios, { HttpStatusCode } from "axios";

const getFirebaseMiddleware = (firebaseAuth: Auth) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    try {
      const firebaseToken = req.get("firebase-token");
      if (!firebaseToken) {
        handleCustomError(res, {
          type: StatusMessageType.ERROR,
          message: "No Firebase token provided",
        });
        return;
      }

      await firebaseAuth.verifyIdToken(firebaseToken);

      if (req.method != "GET") {
        const usersResponse = await axios.get(
          `${process.env.USERS_SERVICE_URL}/api/v1/users/profile`,
          {
            headers: {
              "firebase-token": firebaseToken,
            },
          }
        );

        if (
          !usersResponse ||
          usersResponse.status != HttpStatusCode.Ok ||
          !usersResponse.data ||
          !usersResponse.data.payload ||
          !usersResponse.data.payload.role
        ) {
          handleCustomError(res, {
            type: StatusMessageType.ERROR,
            message:
              "Error while fetching user profile. Please try again later!",
          });
          return;
        }

        if (usersResponse.data.payload.role != "admin") {
          handleCustomError(res, {
            type: StatusMessageType.ERROR,
            message: "Only an authorized admin can perform this action!",
          });
          return;
        }
      }

      next();
      return;
    } catch (err: any) {
      handleServerError(err, res);
      return;
    }
  };
};

export default getFirebaseMiddleware;
