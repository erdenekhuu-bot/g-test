import { Router, Request } from "express";
import { VerifyToken } from "../middleware/checkout";
import { Login, refreshToken } from "../controller/AuthController";
import {
  viewDetail,
  step1create,
  attribute,
  budget,
  risk,
  testteam,
  testcase,
  tesctDesc,
  state,
  team,
  create,
  filter,
} from "../controller/DocumentController";
import {
  updateDetail,
  testcaseupdate,
  documentUpdate,
  listUpdate,
  updateTest,
  updateDocument,
} from "../controller/DocumentUpController";
import { pdfdownload } from "../controller/FileController";
import { deleteStep, deleteRisk } from "../controller/DocumentDelController";
import { employee } from "../controller/EmployeeController";
const router = Router();

router.post("/api/login", Login);
router.post("/api/refresh", refreshToken);

router.get("/api/document/team/:id", team);
router.get("/api/document/list/:id", viewDetail);

router.post("/api/document/filter", VerifyToken, filter);
router.post("/api/document/step/:id", step1create);
router.post("/api/document/create", create);
router.post("/api/document/attribute/:id", attribute);
router.post("/api/document/risk/:id", risk);
router.post("/api/document/budget/:id", budget);
router.post("/api/document/employee/:id", testteam);
router.post("/api/document/testcase/:id", testcase);
router.post("/api/document/testcasedes/:id", tesctDesc);
router.post("/api/document/state", state);

router.patch("/api/document/update/:id", updateDocument);
router.patch("/api/document/testcase/update/:id", testcaseupdate);
router.patch("/api/document/detail/update/:id", updateDetail);
router.patch("/api/document/update/:id", documentUpdate);
router.patch("/api/document/updateList/:id", listUpdate);
router.patch("/api/document/updateStep/:id", updateTest);

router.delete("/api/document/step/:id", deleteStep);
router.delete("/api/document/risk/:id", deleteRisk);

router.get("/api/download/:id", pdfdownload);
router.get("/api/employee", employee);

export default router;
