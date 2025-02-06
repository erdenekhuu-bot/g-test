import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userRouter = Router();

userRouter.get("/api/user/:name", async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.findFirst({
      where: {
        firstname: req.params.name.substring(2),
      },
    });
    const record = await prisma.userData.findUnique({
      where: {
        authUserId: employee?.authUserId ?? undefined,
      },
    });
    res.json({
      success: false,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error,
    });
  }
});

export default userRouter;
