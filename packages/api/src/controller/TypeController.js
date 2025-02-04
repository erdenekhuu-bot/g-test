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
exports.TestTypes = exports.ValidateDocument = void 0;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
const prisma = new client_1.PrismaClient();
class ValidateDocument {
}
exports.ValidateDocument = ValidateDocument;
ValidateDocument.testypes = joi_1.default.object({
    name: joi_1.default.string().max(100).required(),
});
class TestTypes {
}
exports.TestTypes = TestTypes;
_a = TestTypes;
TestTypes.list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield prisma.typesTest.findMany();
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
TestTypes.setName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateDocument.testypes.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }
        const { name } = req.body;
        const record = yield prisma.typesTest.create({
            data: {
                name: name,
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
