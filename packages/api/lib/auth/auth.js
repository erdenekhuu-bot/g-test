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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogin = checkLogin;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("./crypto"));
const ERP_CORE_BASE_URL = (_a = process.env.ERP_CORE_BASE_URL) !== null && _a !== void 0 ? _a : "";
const ERP_SYSTEM_ID = (_b = process.env.ERP_SYSTEM_ID) !== null && _b !== void 0 ? _b : "";
/**
 * ERP  рүү  эрхийг шалгах функц.
 * @param loginModel AuthUserLoginModel эрхийг шалгахад хэрэгтэй мэдээлэл.
 * @returns AuthUserLoginResultModel эрхийг шалгасны эцэст үлдэгдэх мэдээлэл.
 */
function checkLogin(loginModel) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = {
            status: "error",
            statusCode: 500,
            message: "",
        };
        const url = `${ERP_CORE_BASE_URL}/_api/user/check/${ERP_SYSTEM_ID}/node`;
        const plainTextData = crypto_1.default.encrypt(JSON.stringify(loginModel));
        const checkResponse = yield axios_1.default
            .post(url, plainTextData, {
            headers: {
                "Content-Type": "text/plain",
            },
        })
            .then((response) => {
            return response;
        })
            .catch((error) => {
            return error.response;
        });
        const { status } = checkResponse;
        if (status == 200) {
            result.status = "success";
            result.statusCode = 200;
        }
        else if (status == 404) {
            result.status = "error";
            result.statusCode = 404;
            result.message = "Хэрэглэгчийн мэдээлэл олдсонгүй";
        }
        else if (status == 401) {
            result.status = "error";
            result.statusCode = 401;
            result.message = "Нууц үг буруу байна";
        }
        return result;
    });
}
