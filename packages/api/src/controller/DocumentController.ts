import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const DocumentStateEnum = ['DENY', 'ACCESS', 'REJECT'];

export class ValidateDocument {
    static create = Joi.object({
        title: Joi.string().required(),
        state: Joi.string().valid(...DocumentStateEnum).required(), 
        userCreatedId: Joi.number().optional()
    });
    static detail = Joi.object({
        intro: Joi.string().max(200).required(),
        aim: Joi.string().max(200).required(),
        documentId: Joi.string().required(),
    });
}

export class Document {
    static list = async (req:Request, res:Response): Promise<void> => {
        try {
          const record = await prisma.document.findMany(
            {
              include: {
                detail: true,
                permission: true,
                attribute: true,
                budget: true,
                riskassessment: true,
                testcase: true,
                documentemployee: true
              }
            }
          )
          res.json({
            success: true,
            data: record
          })
        } catch (error) {
          res.status(500).json({
            success: false,
            data: error
        });
      }
    }
    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { error } = ValidateDocument.create.validate(req.body);
            if (error) {
                 res.status(400).json({ error: error.details[0].message });
            }
            
            const { title, state } = req.body;
            
            const existingDocument = await prisma.document.findUnique({
                where: { title }
            });
            if (existingDocument) {
                 res.status(400).json({ error: "Document already exists" });
            }
            const document = await prisma.document.create({
                data: {
                    title,
                    state: state.toUpperCase(),
                    documentId: uuidv4()
                }
            });
            res.status(201).json({
                success: true,
                data: document
            });

        } catch (error) {
          res.status(500).json({
            success: false,
            data: error
          });
        }
    }

    static detail = async (req:Request, res:Response) => {
      try {
        const { error } = ValidateDocument.detail.validate(req.body);
            if (error) {
                 res.status(400).json({ error: error.details[0].message });
            }
        const {intro, aim, documentId} = req.body;
        const record = await prisma.documentDetail.create({
          data: {
            intro,
            aim,
            document: {
              connect: documentId
            }
          },
        });
        console.log(record)
        res.status(201).json({
          success: true,
          data: record
      });
      } catch (error) {
        res.status(500).json({
          success: false,
          data: error
        });
      }
    }
}