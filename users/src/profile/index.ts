import { Router } from "express";
import { updateProfileHandler, updateProfileMulter } from "./update";
import { viewProfileHandler } from "./view";
import { deleteProfileHandler } from "./delete";

const router = Router();

router.post("/", updateProfileMulter, updateProfileHandler);
router.get("/", viewProfileHandler);
router.delete("/", deleteProfileHandler);

export default router;
