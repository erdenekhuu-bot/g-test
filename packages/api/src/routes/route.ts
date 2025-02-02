import { Router } from "express";
import { VerifyToken } from "../middleware/checkout";
import { Authentication } from "../controller/AuthController";
import { Document } from "../controller/DocumentController";
import { TestTypes } from "../controller/TypeController";

const router = Router();

router.get("/api", Authentication.list);

//refreshing
router.post("/api/refresh", Authentication.refresh);

//authientication route
router.post("/api/login", Authentication.login);
router.post("/api/register", Authentication.regsiter);
router.patch("/api/patching", VerifyToken.checkout, Authentication.patch);
router.delete("/api/deleting");

router.get("/api/search/index");

//view detail
router.get("/api/detail/:order");
router.post("/api/detail/download");

//document
router.get("/api/documentlist", VerifyToken.checkout, Document.list);
router.get(
  "/api/documentlist/:title",
  VerifyToken.checkout,
  Document.viewDetail
);
router.get("/api/types", VerifyToken.checkout, TestTypes.list);
router.post("/api/types/create", VerifyToken.checkout, TestTypes.setName);
router.post("/api/document/create", VerifyToken.checkout, Document.create);
router.post("/api/document/detail", VerifyToken.checkout, Document.detail);
router.post(
  "/api/document/attribute",
  VerifyToken.checkout,
  Document.attribute
);
router.post("/api/document/budget", VerifyToken.checkout);
router.post("/api/document/risk", VerifyToken.checkout, Document.risk);
router.post("/api/document/permission", VerifyToken.checkout);
router.post("/api/document/testcase", VerifyToken.checkout, Document.testcase);

export default router;
