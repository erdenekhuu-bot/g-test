import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";

const prisma = new PrismaClient();

const zahiral = Joi.object({
    name: Joi.string().email().required(),
    position: Joi.string().required(),
    role: Joi.string().min(6).required(),
    id: Joi.string().optional(),
});

export class Document {
    static zahiral = async (req: Request, res: Response): Promise<void> => {
       try {
        const { error, value } = zahiral.validate(req.body);
        const { name, position, role, id } = value;
        const user = await prisma.user.findUnique({
          where: { id: id },
        });
         res.send(value)
       } catch (error) {
          
       }
      };
}