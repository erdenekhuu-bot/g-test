import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi, { date } from "joi";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export class Employee {
  static list = async (req: Request, res: Response) => {
    try {
      const record = await prisma.employee.findMany();
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
