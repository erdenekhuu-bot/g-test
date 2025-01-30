import express, {Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors"
import { router } from "./routes/route";

dotenv.config();


const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(router)



app.listen(port, () => {
  console.log(`Running on ${port}`);
});
