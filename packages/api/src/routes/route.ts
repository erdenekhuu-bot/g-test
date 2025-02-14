import { Router, Request } from "express";
import { VerifyToken } from "../middleware/checkout";
import { Login } from "../controller/AuthController";
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
  //team,
  // schedules,
  create,
  filter,
  // setTrigger,
  // setMiddle,
} from "../controller/DocumentController";
import {
  updateDetail,
  testcaseupdate,
  documentUpdate,
} from "../controller/DocumentUpController";

const router = Router();


router.post("/api/login", Login);
// router.post("/api/refresh", refresh);

// router.post("/api/login/test", loginTest);
// router.post("/api/login/generate", generate);
// router.post("/api/login/encrypt", trigger);
// router.post("/api/login", login);

// router.get("/api/search/index");
// router.post("/api/document/download");

router.post("/api/document/filter", filter);
router.get("/api/document/list/:id", viewDetail);
router.post("/api/document/step/:id", step1create);
router.post("/api/document/create", create);
router.post("/api/document/attribute/:id", attribute);
router.post("/api/document/risk/:id", risk);
router.post("/api/document/budget/:id", budget);
router.post("/api/document/employee/:id", testteam);
router.post("/api/document/testcase/:id", testcase);
router.post("/api/document/testcasedes/:id", tesctDesc);
router.put("/api/document/testcase/update/:id", testcaseupdate);
router.put("/api/document/detail/update/:id", updateDetail);
router.put("/api/document/update/:id", documentUpdate);
router.post("/api/document/state", state);
//router.get("/api/document/team/:id", team);
// router.get("/api/document/update/:title", update);

// router.post("/api/document/budget", budget);

// router.post("/api/document/permission", VerifyToken.checkout);
// router.post("/api/document/schedule", schedules);
// router.patch("/api/document/trigger/:title", setMiddle);
// router.patch("/api/document/end/:title", setTrigger);
// router.post("/api/types/create", TestTypes.setName);
// router.get("/api/types", TestTypes.list);

export default router;
