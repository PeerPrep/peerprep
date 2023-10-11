import { Router } from "express";
import { updateActivityHandler } from "./update";
import { listActivityHandler } from "./list";

const router = Router();

router.post("/", updateActivityHandler);
router.get("/", listActivityHandler);

export default router;
