import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export class ValidateDocument {
  static data = Joi.object({
    types: Joi.string().optional(),
  });
}

export class Demo {
  static typing = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateDocument.data.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }
      const { types } = req.body;
      const record = await prisma.typesTest.create({
        data: { name: types },
      });
      res.status(201).json({
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
