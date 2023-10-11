import { Request, Response } from "express"
import { Profile } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleServerError } from "../utils";

export async function viewProfileHandler(req: Request, res: Response) {
    const em = req.orm.em.fork();
    const uid = req.userToken.uid;

    try {
        const profile = await em.findOneOrFail(Profile, {
            uid: uid
        });

        const response: ApiResponse = {
            statusMessage: {
            message: "Profile updated successfully",
                type: StatusMessageType.SUCCESS,
            },
            payload: profile,
        };
        res.status(200).send(response);
    } catch (err: any) {
        handleServerError(err, res);
    }
}
