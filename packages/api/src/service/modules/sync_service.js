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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserSyncService = void 0;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
class AuthUserSyncService {
    constructor() {
        this.baseURL = "http://192.168.200.216:8080";
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/service.php/user/list`);
            const { status, data } = response;
            console.log(data);
            if (status !== 200) {
                return;
            }
            for (const AuthUserInfo of data) {
                yield this.syncAuthUser(AuthUserInfo);
            }
        });
    }
    syncAuthUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let AuthUser = yield prisma.user.findUnique({
                where: {
                    id: parseInt(data.id),
                },
            });
            if (!AuthUser) {
                AuthUser = yield prisma.user.create({
                    data: {
                        id: parseInt(data.id),
                        username: data.username,
                        mobile: data.mobile,
                        email: data.email,
                        isDeleted: data.status != "0",
                    },
                });
                console.log(`${AuthUser.id}. ${AuthUser.username} == created`);
            }
            else {
                AuthUser = yield prisma.user.update({
                    where: {
                        id: AuthUser.id,
                    },
                    data: {
                        username: data.username,
                        mobile: data.mobile,
                        email: data.email,
                        isDeleted: data.status != "0",
                    },
                });
                console.log(`${AuthUser.id}, ${AuthUser.username} == updated`);
            }
        });
    }
}
exports.AuthUserSyncService = AuthUserSyncService;
exports.default = AuthUserSyncService;
