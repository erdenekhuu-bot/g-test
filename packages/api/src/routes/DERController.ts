import { Router, Request } from "express";
import { DERFilter } from "../controller/departmentEmployeeController";
import { VerifyToken } from "../middleware/checkout";

const routerDER = Router();

routerDER.post("/api/departmentEmployee/filter", DERFilter);

export default routerDER;