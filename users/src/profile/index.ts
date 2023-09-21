import { Router } from "express";
import { Profile } from "../entities/Profile";


const router = Router()

router.post("/", async (req, res) => {
    const em = req.orm.em.fork();
    
    const uid = req.firebase;
    const body = req.body;

    const profile = await em.upsert(Profile,
            { uid: uid, name: body.name, preferredLang: body.preferredLang, imageUrl: body.imageUrl })

    await em.persistAndFlush(profile);

    res.send({ success: true });
})

export default router
