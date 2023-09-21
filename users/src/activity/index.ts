import { Router } from "express";
import { Activity } from "../entities/Activity";
import { ApiResponse, StatusMessageType } from "../types";
import { handleServerError } from "../utils";

const router = Router()

router.post("/", async (req, res) => {
    const em = req.orm.em.fork();
    
    const uid = req.firebaseToken.uid;
    const body = req.body;

    try {
        const activity = await em.upsert(Activity,
                { uid: uid, questionId: body.questionId })

        await em.persistAndFlush(activity);

        const response: ApiResponse = {
            statusMessage: {
                type: StatusMessageType.SUCCESS,
                message: "Updated user activity"  
            },
            payload: activity
        }

        res.send(response);
    } catch (err: any) {
        handleServerError(err, res)
    }
});

router.get("/", async (req, res) => {
    const em = req.orm.em.fork();
    
    const uid = req.firebaseToken.uid;
    
    const activities = await em.find(Activity, { uid: uid });

    res.send(activities);
});

export default router
