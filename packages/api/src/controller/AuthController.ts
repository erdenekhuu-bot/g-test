import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { Secret, JwtPayload, sign, verify } from "jsonwebtoken";
import Joi from "joi";
import { hash, compare } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class ValidateExpression {
  static register = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });
  static login = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(8).required(),
  });

  static patching = Joi.object({
    email: Joi.string().email().required(),
  });
}

export const generateJwt = (payload: any) => {
  return sign(payload, process.env.JWT_SECRET || "JWT_SECRET", {
    expiresIn: "1m",
  });
};

const prisma = new PrismaClient();
export const documentId = uuidv4();

export class Authentication {
  static list = async (req: Request, res: Response) => {
    try {
      const record = await prisma.user.findMany();
      res.json({
        success: true,
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        data: error,
      });
    }
  };
  static regsiter = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateExpression.register.validate(req.body);
      if (error) {
        res.json({ error: error.details[0].message });
      }
      const { email, name, password } = req.body;
      const existingUser = await prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        res.status(404).json({ error: "User already exists" });
      }
      const hashedPassword = await hash(password, 10);
      const record = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });
      res.json({
        success: true,
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        data: error,
      });
    }
  };

  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = ValidateExpression.login.validate(req.body);
      if (error) {
        res.json({ error: error.details[0].message });
      }
      const { name, password } = req.body;
      const record = await prisma.user.findFirstOrThrow({
        where: { name },
      });
      if (!record) {
        res.status(404).json("User didn't found");
      }
      const isPasswordValid = await compare(password, record.password);
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
      res.status(404).send("Not found");
    }
  };

  static patch = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateExpression.patching.validate(req.body);
      if (error) {
        res.json({ error: error.details[0].message });
      }
      const { email } = req.body;
      const record = await prisma.user.findFirstOrThrow({
        where: { email },
      });
      res.json({ "email triggered": record.email });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  static refresh = async (req: Request, res: Response): Promise<void> => {
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
}
