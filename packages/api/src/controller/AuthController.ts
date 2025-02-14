import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthUserLoginModel } from "../type/type";
import { checkLogin as erpCheckLogin } from "../lib/auth/auth";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.APP_SECRET_KEY ?? "";
const SUPER_PASSWORD = process.env.APP_SUPER_PASSWORD ?? "";


export const Login = async (req: Request, res: Response) => {
  try {
    const authLoginReq: AuthUserLoginModel = req.body;

    const authUser = await prisma.user.findFirst({
      where: {
        username: authLoginReq.username,
        isDeleted: false,
      },
    });

    if (authUser) {
      const employee = await prisma.employee.findUnique({
        where: {
          authUserId: authUser.id
        }
      })
      if (employee) {
        if (SUPER_PASSWORD.length > 0 && SUPER_PASSWORD == authLoginReq.password) {
          console.log("Super Password Login!!!");
        } else {
          const checkLogin = await erpCheckLogin(authLoginReq);
          if (checkLogin.statusCode != 200) {
            res.status(checkLogin.statusCode).json({
              status: "error",
              message: checkLogin.message,
              data: null,
            });
          }
        }

        const tokenAccess = jwt.sign({ _id: authUser.id, email: authUser.email, type: "access" }, SECRET_KEY, {
          expiresIn: "2 hours",
        });

        const tokenRefresh = jwt.sign({ _id: authUser.id, email: authUser.email, type: "refresh" }, SECRET_KEY, {
          expiresIn: "1 days",
        });

        res.json({
          status: true,
          message: "Successfull",
          user: authUser,
          tokens: {
            access: tokenAccess,
            refresh: tokenRefresh,
          },
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Employee not found",
        })
      }
    } else {
      res.status(401).json({
        status: false,
        message: "User not found",
      })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

