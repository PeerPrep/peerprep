import { Request, Response } from "express";
import { Profile } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleServerError } from "../utils";
import { getAuth } from "firebase-admin/auth";

export async function viewProfileHandler(req: Request, res: Response) {
  const em = req.orm.em.fork();
  const uid = req.userToken.uid;

  try {
    const loadedProfile = await em.findOne(Profile, {
      uid: uid,
    });

    let result: Profile;
    if (loadedProfile) {
      result = loadedProfile;
    } else {
      const auth = getAuth(req.firebaseApp);
      const user = await auth.getUser(uid);
      const profile = new Profile();
      profile.uid = uid;
      profile.name = user.displayName;
      await em.persistAndFlush(profile);
      result = profile;
    }

    const response: ApiResponse = {
      statusMessage: {
        message: "Profile updated successfully",
        type: StatusMessageType.SUCCESS,
      },
      payload: result,
    };
    res.status(200).send(response);
  } catch (err: any) {
    handleServerError(err, res);
  }
}
