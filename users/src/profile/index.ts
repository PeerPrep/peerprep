import { Router } from "express";
import { updateProfileHandler, updateProfileMulter } from "./update";
import { viewProfileHandler } from "./view";

const router = Router();

router.post("/", updateProfileMulter, updateProfileHandler);
router.get("/", viewProfileHandler);

export default router;
