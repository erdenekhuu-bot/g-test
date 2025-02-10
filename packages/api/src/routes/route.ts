import { Router, Request } from "express";
import { VerifyToken } from "../middleware/checkout";
import { TestTypes } from "../controller/TypeController";
import {
  login,
  loginTest,
  generate,
  trigger,
  refresh,
} from "../controller/AuthController";
import {
  viewDetail,
  attribute,
  budget,
  risk,
  testcase,
  schedules,
  create,
  list,
  setTrigger,
  setMiddle,
} from "../controller/DocumentController";

const router = Router();

router.post("/api/refresh", refresh);

router.post("/api/login/test", loginTest);
router.post("/api/login/generate", generate);
router.post("/api/login/encrypt", trigger);
router.post("/api/login", login);

router.post("/api/document/download");
router.get("/api/documentlist", list);
router.get("/api/documentlist/:title", viewDetail);

router.post("/api/document/create", create);
router.post("/api/document/attribute", attribute);
router.post("/api/document/budget", budget);
router.post("/api/document/risk", risk);
router.post("/api/document/permission", VerifyToken.checkout);
router.post("/api/document/testcase", testcase);
router.post("/api/document/schedule", schedules);
router.patch("/api/document/trigger/:title", setMiddle);
router.patch("/api/document/end/:title", setTrigger);
router.post("/api/types/create", TestTypes.setName);
router.get("/api/types", TestTypes.list);

export default router;
