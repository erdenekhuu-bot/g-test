import * as crypto from "crypto";

//
const ERP_SECRET_KEY: string = process.env.ERP_SECRET_KEY ?? "";

function encrypt(data: string) {
     const key = crypto.createHash("md5").update(Buffer.from(ERP_SECRET_KEY, "utf8")).digest("hex").substr(0, 24);
     const cipher2 = crypto.createCipheriv("des-ede3", key, Buffer.alloc(0));
     const encData = cipher2.update(data, "utf-8", "hex") + cipher2.final("hex");
     return Buffer.from(encData, "hex").toString("base64");
}

function decrypt(data: string) {
     const key = crypto.createHash("md5").update(Buffer.from(ERP_SECRET_KEY, "utf8")).digest("hex").substr(0, 24);
     const decipher = crypto.createDecipheriv("des-ede3", key, Buffer.alloc(0));
     let decrypted: string = decipher.update(Buffer.from(data, "base64"), undefined, "utf8");
     decrypted += decipher.final("utf8");
     return decrypted;
}

export default { encrypt, decrypt };
