import { Request, Response } from "express";
import { Activity } from "../entities/Activity";
import { ApiResponse, StatusMessageType } from "../types";
import { handleServerError } from "../utils";

export async function updateActivityHandler(req: Request, res: Response) {
  const em = req.orm.em.fork();

  const uid = req.userToken.uid;
  const body = req.body;

  try {
    const activity = await em.upsert(Activity, {
      uid: uid,
      questionId: body.questionId,
      submitted: new Date(),
    });

    await em.persistAndFlush(activity);

    const response: ApiResponse = {
      statusMessage: {
        type: StatusMessageType.SUCCESS,
        message: "Updated user activity",
      },
      payload: activity,
    };

    res.send(response);
  } catch (err: any) {
    handleServerError(err, res);
  }
}
