import { Router } from "express";
import { Profile } from "../entities/Profile";
import { ApiResponse, StatusMessageType } from "../types";
import { handleServerError } from "../utils";


const router = Router()

router.post("/", async (req, res) => {
    const em = req.orm.em.fork();
    
    const uid = req.firebaseToken.uid;
    const body = req.body;

    try {

        const profile = await em.upsert(Profile,
            { uid: uid, name: body.name, preferredLang: body.preferredLang, imageUrl: body.imageUrl })
        
        await em.persistAndFlush(profile);

        const response: ApiResponse = {
            statusMessage: {
                message: "Profile updated successfully",
                type: StatusMessageType.SUCCESS
            },
            payload: profile
        };
        res.status(200).send(response)
    } catch (err: any) {
        handleServerError(err, res)
    }
})

export default router
