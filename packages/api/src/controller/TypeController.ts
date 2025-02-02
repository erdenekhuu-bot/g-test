import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi, { date } from "joi";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export class ValidateDocument {
  static testypes = Joi.object({
    name: Joi.string().max(100).required(),
  });
}

export class TestTypes {
  static list = async (req: Request, res: Response) => {
    try {
      const record = await prisma.typesTest.findMany();
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
  static setName = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateDocument.testypes.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }
      const { name } = req.body;
      const record = await prisma.typesTest.create({
        data: {
          name: name,
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
}
