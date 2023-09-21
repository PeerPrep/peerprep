import Express, { Request, Response, NextFunction } from "express";
import { MikroORM, type PostgreSqlDriver } from "@mikro-orm/postgresql";

import { applicationDefault, initializeApp } from "firebase-admin/app";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import CORS from "cors";

import ProfileRouter from "./profile";
import ActivityRouter from "./activity";
import { handleServerError } from "./utils";

declare global {
  namespace Express {
    interface Request {
      firebaseToken: DecodedIdToken;
      orm: MikroORM;
    }
  }
}

async function initDatabase() {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: ["./dist/entities"],
    entitiesTs: ["./src/entities"],
    clientUrl: process.env.POSTGRES_URL,
  });

  const generator = orm.getSchemaGenerator();

  const createDump = await generator.getCreateSchemaSQL();
  console.log(createDump);

  return orm;
}

initDatabase().then((orm) => {
  const app = Express();

  const firebaseApp = initializeApp({
    credential: applicationDefault(),
  });

  const firebaseAuth = getAuth(firebaseApp);

  const authFirebase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const firebaseToken = req.get("firebase-token");
      if (!firebaseToken) {
        throw "no firebase token";
      }
      req.firebaseToken = await firebaseAuth.verifyIdToken(firebaseToken);
      next();
    } catch (err: any) {
      handleServerError(err, res);
    }
  };

  const setORM = (req: Request, res: Response, next: NextFunction) => {
    req.orm = orm;
    next();
  };

  app.use(Express.json());
  app.use(CORS({ origin: "*" }));
  app.use(authFirebase);
  app.use(setORM);

  app.use("/api/v1/users/profile", ProfileRouter);
  app.use("/api/v1/users/activity", ActivityRouter);

  app.listen(6969, () => {
    console.log("Starting user service");
  });
});
