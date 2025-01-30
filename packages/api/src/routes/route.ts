import { Router } from "express";
import { VerifyToken } from "../middleware/checkout";
import { Authentication } from "../controller/AuthController";
import { Document } from "../controller/DocumentController";

const router = Router()

router.get("/api",Authentication.list);

//refreshing
router.post("/api/refresh", Authentication.refresh);

//authientication route
router.post("/api/login", Authentication.login);
router.post("/api/register", Authentication.regsiter);
router.patch("/api/patching", VerifyToken.checkout, Authentication.patch);
router.delete("/api/deleting");

//search by ajax
router.get("/api/search/index");
router.get("/api/search/employee");
router.get("/api/search/order");

//view detail
router.get("/api/detail/:order");
router.post("/api/detail/download");

//document
router.get("/api/documentlist", VerifyToken.checkout, Document.list);
router.post("/api/document/create", VerifyToken.checkout, Document.create);
router.post("/api/document/detail", VerifyToken.checkout, Document.detail);
router.post("/api/document/attribute", VerifyToken.checkout);
router.post("/api/document/budget", VerifyToken.checkout);
router.post("/api/document/risk", VerifyToken.checkout);
router.post("/api/document/permission", VerifyToken.checkout);

export default router;