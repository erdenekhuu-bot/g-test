import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/route";
import { runSync } from "./service/sync_service";
import fileRouter from "./routes/FileRoute";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(router);
app.use(fileRouter);
app.listen(port, async () => {
  console.log(`Running on ${port}`);
  await runSync();
});
