import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const employee = async (req: Request, res: Response) => {
  const { generate } = req.body;
  const employee = await prisma.employee.findMany({
    where: {
      isDeleted: false,
      firstname: generate || {},
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      jobPosition: true,
      department: true,
    },
  });
  res.json({ success: true, data: employee });
};
