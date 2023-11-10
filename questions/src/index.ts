import bodyParser from "body-parser";
import compression from "compression";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { normalRouter } from "./router";

dotenv.config();

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("error", console.error);

const corsOptions: CorsOptions = {
  origin: "*",
};

const app = express();

app.use(cors(corsOptions));
app.use(compression());
app.use(bodyParser.json());
app.use("/api/v1/", normalRouter());

const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
