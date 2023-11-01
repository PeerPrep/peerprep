import { Request, Response } from "express";
import { Activity } from "../entities/Activity";
import { ApiResponse, StatusMessageType } from "../types";

export async function listActivityHandler(req: Request, res: Response) {
  const em = req.orm.em.fork();

  const uid = req.userToken.uid;

  const activities = await em.find(Activity, { uid: uid });

  const response: ApiResponse = {
    statusMessage: {
      type: StatusMessageType.SUCCESS,
      message: "List user activity",
    },
    payload: activities,
  };

  res.send(response);
}
