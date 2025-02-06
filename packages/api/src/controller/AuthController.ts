import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { Secret, JwtPayload, sign, verify } from "jsonwebtoken";
import { ValidateExpression } from "../schema/validation";
import { hash, compare } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import * as cryptoErp from "../service/modules/auth_service";

export interface AuthUserLoginModel {
  username: string;
  password: string;
}

export const generateJwt = (payload: any) => {
  return sign(payload, process.env.JWT_SECRET || "JWT_SECRET", {
    expiresIn: "1m",
  });
};

const prisma = new PrismaClient();
const documentId = uuidv4();

export async function loginTest(req: Request, res: Response) {
  const loginModel = req.body;
  const reqText = cryptoErp.encrypt(JSON.stringify(loginModel));
  res.json({ reqText, loginModel });
}

export async function generate(req: Request, res: Response) {
  const loginModel = req.body;
  const reqText = cryptoErp.encrypt(JSON.stringify(loginModel));
  res.json({ reqText, loginModel });
}

export async function trigger(req: Request, res: Response) {
  const loginModel = req.body;
  const reqText = cryptoErp.encrypt(JSON.stringify(loginModel));
  res.json({ reqText, loginModel });
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = ValidateExpression.login.validate(req.body);
    if (error) {
      res.json({ error: error.details[0].message });
    }
    const { username, password } = req.body;
    const record = await prisma.user.findFirstOrThrow({
      where: { username },
    });
    if (!record) {
      res.status(404).json("User didn't found");
    }
    const isPasswordValid = await compare(password, record.password!);
    if (!isPasswordValid) {
      res.json({ error: "Password incorrect" });
    }

    const accessToken = generateJwt({
      userId: record.id,
      email: record.email,
    });

    const refreshToken = sign(
      { userId: record.id },
      process.env.SECRET_TOKEN || "REFRESH_SECRET",
      { expiresIn: "1d" }
    );

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error,
    });
  }
};
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(401).json({ error: "Refresh token required" });
      return;
    }

    const decoded = verify(
      token,
      process.env.SECRET_TOKEN || "REFRESH_SECRET"
    ) as JwtPayload;

    const accessToken = generateJwt({
      userId: decoded.userId,
      email: decoded.email,
    });

    res.json({
      accessToken,
      expiresIn: 3600,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};
