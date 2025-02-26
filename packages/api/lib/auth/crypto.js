"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
//
const ERP_SECRET_KEY = (_a = process.env.ERP_SECRET_KEY) !== null && _a !== void 0 ? _a : "";
function encrypt(data) {
    const key = crypto.createHash("md5").update(Buffer.from(ERP_SECRET_KEY, "utf8")).digest("hex").substr(0, 24);
    const cipher2 = crypto.createCipheriv("des-ede3", key, Buffer.alloc(0));
    const encData = cipher2.update(data, "utf-8", "hex") + cipher2.final("hex");
    return Buffer.from(encData, "hex").toString("base64");
}
function decrypt(data) {
    const key = crypto.createHash("md5").update(Buffer.from(ERP_SECRET_KEY, "utf8")).digest("hex").substr(0, 24);
    const decipher = crypto.createDecipheriv("des-ede3", key, Buffer.alloc(0));
    let decrypted = decipher.update(Buffer.from(data, "base64"), undefined, "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
exports.default = { encrypt, decrypt };
