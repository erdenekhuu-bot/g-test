import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { TestcaseEnum } from "@prisma/client";

const prisma = new PrismaClient();
export const deleteStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteStep = await prisma.test.delete({
      where: {
        id: id,
      },
    });
    res.status(201).json({ success: true, data: deleteStep });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const deleteRisk = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.riskAssessment.delete({
      where: {
        id: id,
      },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
