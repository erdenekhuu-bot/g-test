import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ValidateExpression } from "../schema/validation";
import { TestcaseEnum } from "@prisma/client";
import { DocumentStateEnum } from "@prisma/client"

const prisma = new PrismaClient();

export const DERFilter = async (req: Request, res: Response): Promise<void> => {
     try {
          const { generate, firstname, pagination, statement, authUserId } = req.body;

          const paginationOptions = {
               skip:
                    pagination && pagination.page
                         ? (pagination.page - 1) * (pagination.pageSize || 10)
                         : 0,
               take: pagination && pagination.pageSize ? pagination.pageSize : 10,
          };

          const employees = firstname
               ? await prisma.employee.findMany({
                    where: { firstname: { contains: firstname } },
                    include: { authUser: true },
               })
               : [];

          const doc = await prisma.document.findMany({
               ...paginationOptions,
               where: {
                    state: { not: DocumentStateEnum.DENY },
                    ...(generate ? { generate: { contains: generate } } : {}),
                    ...(statement ? { statement: { contains: statement } } : {}),
                    authUserId:
                         employees.length > 0
                              ? {
                                   in: [
                                        ...employees
                                             .map((e) => e.authUser?.id)
                                             .filter((e) => e != null),
                                   ],
                              }
                              : {},
               },
               include: {
                    user: {
                         select: {
                              employee: {
                                   select: {
                                        lastname: true,
                                        firstname: true,
                                   },
                              },
                         },
                    },
               },
          });
          const filteredDocs = doc.filter((d) => d.authUserId === authUserId);
          const totalCount = filteredDocs.length;
          res.status(201).json({
               success: true,
               data: filteredDocs,
               count: totalCount,
               page: paginationOptions.skip,
               pageSize: paginationOptions.take,
          });



     } catch (error) {
          res.status(500).json({
               success: false,
               data: error,
          });
     }
};
