import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { TestcaseEnum } from "@prisma/client";
import exp from "constants";

const prisma = new PrismaClient();
export const deleteStep = async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const deleteStep = await prisma.departmentEmployeeRole.delete({
               where: {
                    id: id
               },
          })
          res.status(201).json({ success: true, data: deleteStep })
     } catch (error) {
          res.status(500).json({ success: false, error: error })
     }
}

export const deleteAttirbute = async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const deleteAttirbute = await prisma.documentAttribute.delete({
               where: {
                    id: id
               }
          })
          res.status(201).json({ succesS: true, data: deleteAttirbute })
     } catch (error) {
          res.status(500).json({ success: false, error: error })
     }
}

export const deleteRisk = async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const deleteRisk = await prisma.riskAssessment.delete({
               where: {
                    id: id
               }
          })
          res.status(201).json({ succesS: true, data: deleteRisk })
     } catch (error) {
          res.status(500).json({ success: false, error: error })
     }
}


export const deleteBudget = async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const deleteBudget = await prisma.documentBudget.delete({
               where: {
                    id: id
               }
          })
          res.status(201).json({ succesS: true, data: deleteBudget })
     } catch (error) {
          res.status(500).json({ success: false, error: error })
     }
}

export const deleteTeam = async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const deleteTeam = await prisma.documentEmployee.delete({
               where: {
                    id: id
               }
          })
          res.status(201).json({ succesS: true, data: deleteTeam })
     } catch (error) {
          res.status(500).json({ success: false, error: error })
     }
}

export const deleteTestcase = async (req: Request, res: Response) => {
     try {
          const { id } = req.params

          const deletecase = await prisma.testCase.delete({
               where: {
                    id: id
               }
          })

          res.status(201).json({ succesS: true, data: deletecase })
     } catch (error) {
          res.status(500).json({ success: false, error: error })
     }
}

