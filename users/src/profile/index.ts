import { Router } from "express";
import { updateProfileHandler, updateProfileMulter } from "./update";
import { viewProfileHandler } from "./view";
import { deleteProfileHandler } from "./delete";
import { checkProfileHandler } from "./check";

const router = Router();

router.post("/", updateProfileMulter, updateProfileHandler);
router.get("/", viewProfileHandler);
router.get("/check", checkProfileHandler);
router.delete("/", deleteProfileHandler);

export default router;
