export interface AuthUserLoginModel {
     username: string;
     password: string;
}

export interface AuthUserLoginResultModel {
     status: "success" | "error";
     statusCode: number;
     message: string;
}

export interface AuthUserPayloadModel {
     id: number;
     username: string;
     mobile: string;
     email: string;
     isDeleted: boolean;
}