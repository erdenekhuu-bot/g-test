import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ValidateExpression } from "../schema/validation";
import { TestcaseEnum } from "@prisma/client";
import path from "path";
import { number } from "joi";
const prisma = new PrismaClient();


export const updateDetail = async (req: Request, res: Response) => {
     try {
          const { id } = (req.params);

          const { aim, intro } = req.body;

          const update = await prisma.documentDetail.update({
               where: {
                    id: id
               },
               data: { intro, aim }
          });
          res.status(201).json({
               success: true, data: update,
          });
     } catch (error) {
          res.status(500).json({ success: false, data: error, })
     }
}

export const testcaseupdate = async (req: Request, res: Response) => {
     try {
          const { id } = (req.params);
          const { testType } = req.body;
          if (testType === TestcaseEnum.STARTED) {
               const update = await prisma.testCase.update({
                    where: {
                         id: id,
                    },
                    data: {
                         startDate: new Date(),
                         testType: testType.toUpperCase()
                    },
               })
               res.status(201).json({
                    success: true, data: update,
               });
          } else if (testType === TestcaseEnum.ENDED) {
               const update = await prisma.testCase.update({
                    where: {
                         id: id,
                    },
                    data: {
                         endDate: new Date(),
                         testType: testType.toUpperCase()
                    },
               })
               res.status(201).json({
                    success: true, data: update,
               });
          } else {
               res.status(400).json({ success: false, message: "error" })
          }
     } catch (error) {
          res.status(500).json({ success: false, message: error })
     }
}

export const documentUpdate = async (req: Request, res: Response) => {
     try {
          const { id } = (req.params);
          const parsedId = Number(id);
          const { title, state, statement } = req.body;

          const stateDocument = await prisma.document.findUnique({
               where: { id: parsedId },
          });

          const update = await prisma.document.update({
               where: {
                    id: parsedId,
               },
               data: {
                    title,
                    statement,
                    state: state ? state.toUpperCase() : stateDocument?.state,
               }
          });
          res.status(201).json({
               success: true, data: update,
          });
     } catch (error) {
          res.status(500).json({ success: false, data: error, })
     }
}


