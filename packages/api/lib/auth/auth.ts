import axios, { AxiosResponse } from "axios";
import { AuthUserLoginModel, AuthUserLoginResultModel } from "../../src/type/type";
import erpCrypto from "./crypto";

const ERP_CORE_BASE_URL = process.env.ERP_CORE_BASE_URL ?? "";
const ERP_SYSTEM_ID = process.env.ERP_SYSTEM_ID ?? "";

/**
 * ERP  рүү  эрхийг шалгах функц.
 * @param loginModel AuthUserLoginModel эрхийг шалгахад хэрэгтэй мэдээлэл.
 * @returns AuthUserLoginResultModel эрхийг шалгасны эцэст үлдэгдэх мэдээлэл.
 */
async function checkLogin(loginModel: AuthUserLoginModel): Promise<AuthUserLoginResultModel> {
     const result: AuthUserLoginResultModel = {
          status: "error",
          statusCode: 500,
          message: "",
     };

     const url = `${ERP_CORE_BASE_URL}/_api/user/check/${ERP_SYSTEM_ID}/node`;
     const plainTextData = erpCrypto.encrypt(JSON.stringify(loginModel));

     const checkResponse: AxiosResponse = await axios
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
     } else if (status == 404) {
          result.status = "error";
          result.statusCode = 404;
          result.message = "Хэрэглэгчийн мэдээлэл олдсонгүй";
     } else if (status == 401) {
          result.status = "error";
          result.statusCode = 401;
          result.message = "Нууц үг буруу байна";
     }

     return result;
}

export { checkLogin };
