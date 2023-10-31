import Express, { Request, Response, NextFunction } from "express";
import { MikroORM, type PostgreSqlDriver } from "@mikro-orm/postgresql";
import "dotenv/config";

import { App, applicationDefault, initializeApp } from "firebase-admin/app";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import CORS from "cors";

import ProfileRouter from "./profile";
import ActivityRouter from "./activity";
import AdminRouter from "./admin";

import { handleServerError } from "./utils";

declare global {
  namespace Express {
    interface Request {
      firebaseApp: App;
      userToken: DecodedIdToken;
      orm: MikroORM;
    }
  }
}

async function initDatabase() {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: ["./build/entities"],
    entitiesTs: ["./src/entities"],
    clientUrl: process.env.POSTGRES_URL,
  });

  const generator = orm.getSchemaGenerator();

  const updateDump = await generator.getUpdateSchemaSQL();
  console.log(updateDump);

  await generator.updateSchema();

  return orm;
}

initDatabase().then((orm) => {
  const app = Express();

  const firebaseApp = initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.BUCKET_NAME,
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
      req.userToken = await firebaseAuth.verifyIdToken(firebaseToken);
      next();
    } catch (err: any) {
      handleServerError(err, res);
    }
  };

  const injectDependencies = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    req.orm = orm;
    req.firebaseApp = firebaseApp;
    next();
  };

  app.use(Express.json());
  app.use(CORS({ origin: "*" }));
  app.use(authFirebase);
  app.use(injectDependencies);

  app.use("/api/v1/users/profile", ProfileRouter);
  app.use("/api/v1/users/activity", ActivityRouter);
  app.use("/api/v1/users/admin", AdminRouter);

  app.listen(6969, () => {
    console.log("Starting user service");
  });
});
