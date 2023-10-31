import { Request, Response } from "express";
import { Profile, Role } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleCustomError, handleServerError } from "../utils";

export async function updateRoleHandler(req: Request, res: Response) {
  const em = req.orm.em.fork();
  const body = req.body;

  try {
    if (body.role !== Role.USER && body.role !== Role.ADMIN) {
      return handleCustomError(res, {
        message: "Invalid role specified",
        type: StatusMessageType.ERROR,
      });
    }

    const loadedProfile = await em.findOneOrFail(Profile, {
      uid: body.uid,
    });

    loadedProfile.role = body.role;

    await em.flush();

    const response: ApiResponse = {
      statusMessage: {
        message: "Role updated successfully",
        type: StatusMessageType.SUCCESS,
      },
      payload: loadedProfile,
    };
    res.status(200).send(response);
  } catch (err: any) {
    handleServerError(err, res);
  }
}
