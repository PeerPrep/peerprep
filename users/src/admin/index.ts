import { Router, Request, Response, NextFunction } from "express";
import { updateRoleHandler } from "./update";
import { listProfileHandler } from "./list";
import { handleCustomError, handleServerError } from "../utils";
import { StatusMessageType } from "../types";
import { Profile, Role } from "../entities/Profile";

const router = Router();

router.use(async (req: Request, res: Response, next: NextFunction) => {
  const em = req.orm.em.fork();
  const uid = req.userToken.uid;

  try {
    const profile = await em.findOneOrFail(Profile, {
      uid: uid,
    });

    if (profile.role == Role.USER) {
      return handleCustomError(res, {
        type: StatusMessageType.ERROR,
        message: "Insufficient Permissions",
      });
    }

    next();
  } catch (err: any) {
    handleServerError(err, res);
  }
});

router.post("/update", updateRoleHandler);
router.get("/profiles", listProfileHandler);

export default router;
