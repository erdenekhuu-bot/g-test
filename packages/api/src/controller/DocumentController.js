"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = exports.ValidateDocument = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const DocumentStateEnum = ["DENY", "ACCESS", "REJECT"];
const States = ["DENY", "ACCESS", "REJECT"];
class ValidateDocument {
}
exports.ValidateDocument = ValidateDocument;
ValidateDocument.create = joi_1.default.object({
    title: joi_1.default.string().required(),
    state: joi_1.default.string()
        .valid(...DocumentStateEnum)
        .required(),
    userCreatedId: joi_1.default.number().optional(),
});
ValidateDocument.detail = joi_1.default.object({
    intro: joi_1.default.string().max(200).required(),
    aim: joi_1.default.string().max(200).required(),
    documentId: joi_1.default.string().required(),
});
ValidateDocument.attribute = joi_1.default.object({
    id: joi_1.default.string().required(),
    categoryMain: joi_1.default.string().max(250).required(),
    category: joi_1.default.string().max(250).required(),
    value: joi_1.default.string().optional(),
});
ValidateDocument.risk = joi_1.default.object({
    id: joi_1.default.string().required(),
    riskDescription: joi_1.default.string().required(),
    riskLevel: joi_1.default.number().required(),
    affectionLevel: joi_1.default.number().required(),
    mitigationStrategy: joi_1.default.string().optional(),
});
ValidateDocument.testcase = joi_1.default.object({
    id: joi_1.default.string().required(),
    category: joi_1.default.string().max(100).required(),
    types: joi_1.default.string().max(100).required(),
    steps: joi_1.default.string().required(),
    result: joi_1.default.string().max(100).required(),
    division: joi_1.default.string().max(100).required(),
});
ValidateDocument.budget = joi_1.default.object({
    id: joi_1.default.string().required(),
    productCategory: joi_1.default.string().required(),
    product: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
    priceUnit: joi_1.default.number().optional(),
    priceTotal: joi_1.default.number().optional(),
});
ValidateDocument.schedules = joi_1.default.object({
    id: joi_1.default.string().required(),
    employee: joi_1.default.string().required(),
    role: joi_1.default.string().max(100).required(),
    created: joi_1.default.date().required(),
    ended: joi_1.default.date().required(),
});
class Document {
}
exports.Document = Document;
_a = Document;
Document.list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield prisma.document.findMany();
        res.json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.viewDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.params;
        const record = yield prisma.document.findFirst({
            where: {
                title: title,
            },
            include: {
                detail: true,
                attribute: true,
                riskassessment: true,
                testcase: true,
                budget: true,
                schedule: {
                    include: {
                        employee: true,
                    },
                },
            },
        });
        res.json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateDocument.create.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        const { title, state } = req.body;
        const existingDocument = yield prisma.document.findUnique({
            where: { title },
        });
        if (existingDocument) {
            res.status(400).json({ error: "Document already exists" });
        }
        const document = yield prisma.document.create({
            data: {
                title,
                state: state.toUpperCase(),
                id: (0, uuid_1.v4)(),
            },
        });
        res.status(201).json({
            success: true,
            data: document,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateDocument.detail.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        const { intro, aim, documentId } = req.body;
        const record = yield prisma.documentDetail.create({
            data: {
                intro,
                aim,
                documentId: documentId,
            },
        });
        res.status(201).json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.attribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateDocument.attribute.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        const { categoryMain, category, value, id } = req.body;
        const record = yield prisma.documentAttribute.create({
            data: {
                categoryMain: categoryMain,
                category: category,
                value: value,
                documentId: id,
            },
        });
        res.json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.risk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateDocument.risk.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        const { id, riskDescription, riskLevel, affectionLevel, mitigationStrategy, } = req.body;
        const record = yield prisma.riskAssessment.create({
            data: {
                riskDescription: riskDescription,
                riskLevel: riskLevel,
                affectionLevel: affectionLevel,
                mitigationStrategy: mitigationStrategy,
                documentId: id,
            },
        });
        res.json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.testcase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateDocument.testcase.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        const { id, category, types, steps, result, division } = req.body;
        const record = yield prisma.testCase.create({
            data: {
                category: category,
                types: types,
                steps: steps,
                result: result,
                division: division,
                documentId: id,
            },
        });
        res.json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.budget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateDocument.budget.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        const { id, productCategory, product, amount, priceTotal, priceUnit } = req.body;
        const record = yield prisma.documentBudget.create({
            data: {
                productCategory: productCategory,
                product: product,
                amount: amount,
                priceTotal: priceTotal,
                priceUnit: priceUnit,
                documentId: id,
            },
        });
        res.status(201).json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.schedules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateDocument.schedules.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        const { employee, role, created, ended, id } = req.body;
        const findemployee = yield prisma.employee.findFirst({
            where: {
                lastname: employee,
            },
        });
        if (!findemployee) {
            res.status(404).json({ error: "Employee not found" });
        }
        const finddocument = yield prisma.document.findFirst({
            where: { id: id },
        });
        const record = yield prisma.schedule.create({
            data: {
                role: role,
                created: new Date(created),
                ended: new Date(ended),
                employee: {
                    connect: { id: findemployee === null || findemployee === void 0 ? void 0 : findemployee.id },
                },
                document: {
                    connect: { id: finddocument === null || finddocument === void 0 ? void 0 : finddocument.id },
                },
            },
        });
        res.status(201).json({
            success: true,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
Document.schedulelist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield prisma.schedule.findMany();
        res.json({
            success: false,
            data: record,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});
