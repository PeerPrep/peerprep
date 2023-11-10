import { Request, Response } from "express";
import { Profile } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleServerError } from "../utils";

interface CheckResult {
    profileExists: boolean;
    profile: Profile | null;
};

export async function checkProfileHandler(req: Request, res: Response) {
  const em = req.orm.em.fork();
  const uid = req.userToken.uid;

  try {
    const loadedProfile = await em.findOne(Profile, {
      uid: uid,
    });

    let result: CheckResult = { profileExists: false, profile: null };

    if (loadedProfile) {
      result.profileExists = true;
      result.profile = loadedProfile;
    }

    const response: ApiResponse = {
      statusMessage: {
        message: "Profile checked successfully",
        type: StatusMessageType.SUCCESS,
      },
      payload: result,
    };
    res.status(200).send(response);
  } catch (err: any) {
    handleServerError(err, res);
  }
}
