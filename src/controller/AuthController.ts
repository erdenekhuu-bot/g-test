import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {hash, compare } from "bcrypt";
import Joi from "joi";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export const generateJwt = (seed: any) => {
  return sign(seed, "JWT_SECRET");
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
        res.status(200).json({ token: generateJwt({ email }) });
      } catch (error) {
        res.status(404).send("Not found");
      }
    };

    static Update = async (req:Request, res:Response):Promise<void>=>{
      try {
        
      } catch (error) {
        
      }
    }

    static refresh = async (req:Request, res:Response): Promise<void> => {
        try {
            
        } catch (error) {
            
        }
    }

    static UserList = async (req:Request, res:Response):Promise<void> => {
      try {
        const record = await prisma.user.findMany()
        if(record){
          res.json(record)
        }
      } catch (error) {
        res.send(error)
      }
    }
}