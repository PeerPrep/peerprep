import { Request, Response } from "express";
import { Profile, Role } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleCustomError, handleServerError } from "../utils";

export async function updateRoleHandler(req: Request, res: Response) {
    const em = req.orm.em.fork();
    const body = req.body;

    try {
        if (!(body.role in Role)) {
            return handleCustomError(
                res,
                {
                    message: "Invalid role specified",
                    type: StatusMessageType.ERROR
                }
            );
        }
        const profile = await em.upsert(Profile, {
            uid: body.uid,
            role: body.role
        });

        await em.persistAndFlush(profile);

        const response: ApiResponse = {
            statusMessage: {
                message: "Role updated successfully",
                type: StatusMessageType.SUCCESS,
            },
            payload: profile,
        };
        res.status(200).send(response);
    } catch (err: any) {
        handleServerError(err, res);
    }
}
