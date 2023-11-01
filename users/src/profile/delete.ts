import { Request, Response } from "express";
import { Profile } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleServerError } from "../utils";
import { getAuth } from "firebase-admin/auth";
import { Activity } from "../entities/Activity";

export async function deleteProfileHandler(req: Request, res: Response) {
  const em = req.orm.em.fork();
  const uid = req.userToken.uid;

  try {
    await em.transactional(async (manager) => {
        await manager.nativeDelete(Profile, { uid: uid });
        await manager.nativeDelete(Activity, { uid: uid });
    });

    const response: ApiResponse = {
      statusMessage: {
        message: "Profile deleted successfully",
        type: StatusMessageType.SUCCESS,
      },
      payload: {},
    };
    res.status(200).send(response);
  } catch (err: any) {
    handleServerError(err, res);
  }
}
