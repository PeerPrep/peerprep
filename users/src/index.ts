import Express, { Request, Response, NextFunction } from "express"
import { MikroORM, type PostgreSqlDriver } from "@mikro-orm/postgresql"

import { applicationDefault, initializeApp } from "firebase-admin/app"
import { DecodedIdToken, getAuth } from "firebase-admin/auth"

import ProfileRouter from "./profile"

const firebaseApp = initializeApp({
    credential: applicationDefault()
});

const firebaseAuth = getAuth(firebaseApp)

declare global {
    namespace Express {
        interface Request {
            firebaseToken: DecodedIdToken
            orm: MikroORM
        }
    }
}

async function initDatabase() {
    const orm = await MikroORM.init<PostgreSqlDriver>({
        entities: ["./dist/entities"],
        entitiesTs: ["./src/entities"],
        dbName: "peerprep",
        user: "peerprep",
        password: "password"
    });

    const generator = orm.getSchemaGenerator();

    const createDump = await generator.getCreateSchemaSQL();
    console.log(createDump);

    return orm;
}

initDatabase().then((orm) => {
    const app = Express()

    const authFirebase = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const firebaseToken = req.get("firebase-token");
            if (!firebaseToken) {
                throw "no firebase token";
            }
            req.firebaseToken = await firebaseAuth.verifyIdToken(firebaseToken);
            next()
        } catch {
            res.status(401).send("Token invalid")
        }
    }

    const setORM = (req: Request, res: Response, next: NextFunction) => {
        req.orm = orm
        next()
    }

    app.use(Express.json())
    app.use(authFirebase)
    app.use(setORM)
    app.use("/profile", ProfileRouter)

    app.listen(3000, () => {
        console.log("Starting user service");
    });
})

