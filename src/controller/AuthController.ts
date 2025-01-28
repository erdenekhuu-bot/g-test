import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {hash, compare } from "bcrypt";
import Joi from "joi";
import jwt, { Secret, JwtPayload, sign, verify } from 'jsonwebtoken';
import { CustomRequest } from '../middleware/middle';

export const prisma = new PrismaClient();

export const generateJwt = (payload: any) => {
  return sign(
    payload, 
    process.env.JWT_SECRET || "JWT_SECRET",
    { 
      expiresIn: '1m'
    }
  );
};

const register = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

const refreshtoken = Joi.object({
  token: Joi.string().optional()
})

export class Auth {
    static register = async (req: Request, res: Response): Promise<void> => {
      try {
        const { error } = register.validate(req.body);
        if (error) {
          res.status(400).json({ error: error.details[0].message });
        }
        const { email, name, password } = req.body;
        const hashedPassword = await hash(password, 10);
        const record = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
          },
        });
        res.status(201).json(record);
      } catch (error) {
        res.status(500).send(error);
      }
    };

    static Login = async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body;
        const record = await prisma.user.findFirstOrThrow({
          where: { email },
        });
        if (!record) {
          throw new Error("User didn't found");
        }
        const isPasswordValid = await compare(password, record.password);
        if (!isPasswordValid) {
          res.status(401).json({ error: "Password incorrect" });
          return;
        }

        // Generate access token
        const accessToken = generateJwt({ 
          userId: record.id, 
          email: record.email,
        });

        // Generate refresh token
        const refreshToken = sign(
          { userId: record.id },
          process.env.REFRESH_TOKEN_SECRET || 'REFRESH_SECRET',
          { expiresIn: '7d' }
        );

        res.status(200).json({ 
          accessToken,
          refreshToken,
          expiresIn: 60
        });
      } catch (error) {
        res.status(404).send("Not found");
      }
    };

    static Update = async (req:Request, res:Response):Promise<void>=>{
      try {
        
      } catch (error) {
        
      }
    }

    static refresh = async (req: Request, res: Response): Promise<void> => {
      try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
          res.status(401).json({ error: "Refresh token required" });
          return;
        }

        const decoded = verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET || 'REFRESH_SECRET'
        ) as JwtPayload;

        // Generate new access token
        const accessToken = generateJwt({ 
          userId: decoded.userId,
          email: decoded.email 
        });

        res.json({ 
          accessToken,
          expiresIn: 3600
        });
      } catch (error) {
        res.status(401).json({ error: "Invalid refresh token" });
      }
    };

    static UserList = async (req: CustomRequest, res: Response): Promise<void> => {
      try {
        // Access the decoded user info
        const userId = req.user?.userId;
        
        const record = await prisma.user.findMany();
        if(record){
          res.json(record);
        }
      } catch (error) {
        res.send(error);
      }
    }
}