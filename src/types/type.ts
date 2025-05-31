export type ListDataType = {
  key: number;
  index: string;
  testname: any;
  order: string;
  employee: string;
  datetime: any;
  status: any;
};

export type SearchParams = {
  page: string;
  pageSize: string;
  order?: string;
};

import { JwtPayload } from "jsonwebtoken";

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

interface AuthRequest extends Request {
  token: JwtPayload;
}

export type { AuthRequest };
