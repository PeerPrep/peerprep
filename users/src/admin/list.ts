import { Request, Response } from "express";
import { Profile } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleServerError } from "../utils";

export async function listProfileHandler(req: Request, res: Response) {
  const em = req.orm.em.fork();

  try {
    const profiles = await em.find(Profile, {});

    const response: ApiResponse = {
      statusMessage: {
        message: "Listed profiles successfully",
        type: StatusMessageType.SUCCESS,
      },
      payload: profiles,
    };
    res.status(200).send(response);
  } catch (err: any) {
    handleServerError(err, res);
  }
}
