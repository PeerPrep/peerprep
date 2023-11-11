import bodyParser from "body-parser";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import http from "http";
import mongoose from "mongoose";
import getFirebaseMiddleware from "./middleware/auth";
import validatePasswordHeader from "./middleware/serverless";
import { normalRouter, serverlessRouter } from "./router";

dotenv.config();

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("error", console.error);

const firebaseApp = initializeApp({
  credential: applicationDefault(),
  storageBucket: process.env.BUCKET_NAME,
});

const firebaseAuth = getAuth(firebaseApp);

const corsOptions: CorsOptions = {
  origin: "*",
};

const app = express();

app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use("/api/v1/", getFirebaseMiddleware(firebaseAuth), normalRouter());
app.use("/api/serverless/", validatePasswordHeader(), serverlessRouter());

const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
