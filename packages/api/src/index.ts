import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/route";
import AuthUserSyncService from "./service/modules/sync_authuser_service";
import EmployeeSyncService from "./service/modules/sync_employee_service";
import DepartmentSyncService from "./service/modules/sync_department_service";
import JobPositionSyncService from "./service/modules/sync_jobposition_service";
import fileRouter from "./routes/FileRoute";

dotenv.config();

const authUserSyncService = new AuthUserSyncService();
const employeeSyncService = new EmployeeSyncService();
const departmentSyncService = new DepartmentSyncService();
const jobposition = new JobPositionSyncService();
const app = express();
const port = process.env.PORT;
// jobposition
//   .sync()
//   .then(() => {
//     console.log("Fetch completed");
//   })
//   .catch((error) => {
//     console.error("Fetch failed ", error);
//   });
app.use(cors());
app.use(express.json());
app.use(router);
app.use(fileRouter);
app.listen(port, async () => {
  console.log(`Running on ${port}`);
});
