import Express, { Request, Response, NextFunction } from "express"
import { MikroORM, type PostgreSqlDriver } from "@mikro-orm/postgresql"

import ProfileRouter from "./profile"


declare global {
    namespace Express {
        interface Request {
            firebase: string
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

    const authFirebase = (req: Request, res: Response, next: NextFunction) => {
        req.firebase = req.body.token.uid
        next()
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

