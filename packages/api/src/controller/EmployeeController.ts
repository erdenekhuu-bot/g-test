import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const employee = async (req: Request, res: Response) => {
  const { generate, page, pageSize} = req.body;
  
  const paginationOptions = {
    skip:
      page && pageSize
        ? (page - 1) * (pageSize || 100)
        : 0,
    take: page && pageSize ? pageSize : 100,
  };

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
    skip: paginationOptions.skip,
    take: paginationOptions.take,
  });

  const totalCount = await prisma.employee.count({
    where: {
      isDeleted: false,
    }
  });
  res.json({ success: true, data: employee,  count: totalCount,
    page: page || 1,
    pageSize: paginationOptions.take, });
};
