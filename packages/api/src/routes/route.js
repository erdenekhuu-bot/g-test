"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_1 = require("../middleware/checkout");
const AuthController_1 = require("../controller/AuthController");
const DocumentController_1 = require("../controller/DocumentController");
const TypeController_1 = require("../controller/TypeController");
const EmployeeController_1 = require("../controller/EmployeeController");
const router = (0, express_1.Router)();
router.get("/api", AuthController_1.Authentication.list);
//refreshing
router.post("/api/refresh", AuthController_1.Authentication.refresh);
//authientication route
router.post("/api/login", AuthController_1.Authentication.login);
router.post("/api/register", AuthController_1.Authentication.regsiter);
router.patch("/api/patching", checkout_1.VerifyToken.checkout, AuthController_1.Authentication.patch);
router.delete("/api/deleting");
router.get("/api/search/index");
//view detail
router.get("/api/detail/:order");
router.post("/api/detail/download");
//all document route
router.get("/api/documentlist", checkout_1.VerifyToken.checkout, DocumentController_1.Document.list);
router.get("/api/documentlist/:title", checkout_1.VerifyToken.checkout, DocumentController_1.Document.viewDetail);
router.post("/api/document/create", checkout_1.VerifyToken.checkout, DocumentController_1.Document.create);
router.post("/api/document/detail", checkout_1.VerifyToken.checkout, DocumentController_1.Document.detail);
router.post("/api/document/attribute", checkout_1.VerifyToken.checkout, DocumentController_1.Document.attribute);
router.post("/api/document/budget", checkout_1.VerifyToken.checkout, DocumentController_1.Document.budget);
router.post("/api/document/risk", checkout_1.VerifyToken.checkout, DocumentController_1.Document.risk);
router.post("/api/document/permission", checkout_1.VerifyToken.checkout);
router.post("/api/document/testcase", checkout_1.VerifyToken.checkout, DocumentController_1.Document.testcase);
router.post("/api/document/schedule", checkout_1.VerifyToken.checkout, DocumentController_1.Document.schedules);
//all types route
router.post("/api/types/create", checkout_1.VerifyToken.checkout, TypeController_1.TestTypes.setName);
router.get("/api/types", checkout_1.VerifyToken.checkout, TypeController_1.TestTypes.list);
router.get("/api/employee", checkout_1.VerifyToken.checkout, EmployeeController_1.Employee.list);
router.get("/api/schedule/list", checkout_1.VerifyToken.checkout, DocumentController_1.Document.schedulelist);
exports.default = router;
