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
exports.Authentication = exports.documentId = exports.generateJwt = exports.ValidateExpression = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = require("bcrypt");
const uuid_1 = require("uuid");
class ValidateExpression {
}
exports.ValidateExpression = ValidateExpression;
ValidateExpression.register = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    name: joi_1.default.string().required(),
    password: joi_1.default.string().min(8).required(),
});
ValidateExpression.login = joi_1.default.object({
    name: joi_1.default.string().required(),
    password: joi_1.default.string().min(8).required(),
});
ValidateExpression.patching = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
const generateJwt = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET || "JWT_SECRET", {
        expiresIn: "1m",
    });
};
exports.generateJwt = generateJwt;
const prisma = new client_1.PrismaClient();
exports.documentId = (0, uuid_1.v4)();
class Authentication {
}
exports.Authentication = Authentication;
_a = Authentication;
Authentication.list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield prisma.user.findMany();
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
Authentication.regsiter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateExpression.register.validate(req.body);
        if (error) {
            res.json({ error: error.details[0].message });
        }
        const { email, name, password } = req.body;
        const existingUser = yield prisma.user.findFirst({
            where: { email },
        });
        if (existingUser) {
            res.status(404).json({ error: "User already exists" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const record = yield prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                employee: {
                    create: {
                        firstname: "gmobile",
                        lastname: "gmoblie",
                        gender: "male",
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
Authentication.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateExpression.login.validate(req.body);
        if (error) {
            res.json({ error: error.details[0].message });
        }
        const { name, password } = req.body;
        const record = yield prisma.user.findFirstOrThrow({
            where: { name },
        });
        if (!record) {
            res.status(404).json("User didn't found");
        }
        const isPasswordValid = yield (0, bcrypt_1.compare)(password, record.password);
        if (!isPasswordValid) {
            res.json({ error: "Password incorrect" });
        }
        const accessToken = (0, exports.generateJwt)({
            userId: record.id,
            email: record.email,
        });
        const refreshToken = (0, jsonwebtoken_1.sign)({ userId: record.id }, process.env.SECRET_TOKEN || "REFRESH_SECRET", { expiresIn: "1d" });
        res.json({
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(404).send("Not found");
    }
});
Authentication.patch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error } = ValidateExpression.patching.validate(req.body);
        if (error) {
            res.json({ error: error.details[0].message });
        }
        const { email } = req.body;
        const record = yield prisma.user.findFirstOrThrow({
            where: { email },
        });
        res.json({ "email triggered": record.email });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
Authentication.refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(401).json({ error: "Refresh token required" });
            return;
        }
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.SECRET_TOKEN || "REFRESH_SECRET");
        const accessToken = (0, exports.generateJwt)({
            userId: decoded.userId,
            email: decoded.email,
        });
        res.json({
            accessToken,
            expiresIn: 3600,
        });
    }
    catch (error) {
        res.status(401).json({ error: "Invalid refresh token" });
    }
});
