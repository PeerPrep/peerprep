import { Router } from "express";
import { Activity } from "../entities/Activity";


const router = Router()

router.post("/", async (req, res) => {
    const em = req.orm.em.fork();
    
    const uid = req.firebaseToken.uid;
    const body = req.body;

    const activity = await em.upsert(Activity,
            { uid: uid, questionId: body.questionId })

    await em.persistAndFlush(activity);

    res.send({ success: true });
});

router.get("/", async (req, res) => {
    const em = req.orm.em.fork();
    
    const uid = req.firebaseToken.uid;
    
    const activities = await em.find(Activity, { uid: uid });

    res.send(activities);
});

export default router
