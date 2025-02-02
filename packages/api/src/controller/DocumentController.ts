import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi, { date } from "joi";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const DocumentStateEnum = ["DENY", "ACCESS", "REJECT"];

const States = ["DENY", "ACCESS", "REJECT"];

export class ValidateDocument {
  static create = Joi.object({
    title: Joi.string().required(),
    state: Joi.string()
      .valid(...DocumentStateEnum)
      .required(),
    userCreatedId: Joi.number().optional(),
  });
  static detail = Joi.object({
    intro: Joi.string().max(200).required(),
    aim: Joi.string().max(200).required(),
    documentId: Joi.string().required(),
  });
  static attribute = Joi.object({
    id: Joi.string().required(),
    categoryMain: Joi.string().max(250).required(),
    category: Joi.string().max(250).required(),
    value: Joi.string().optional(),
  });
  static risk = Joi.object({
    id: Joi.string().required(),
    riskDescription: Joi.string().required(),
    riskLevel: Joi.number().required(),
    affectionLevel: Joi.number().required(),
    mitigationStrategy: Joi.string().optional(),
  });
  static testcase = Joi.object({
    id: Joi.string().required(),
    category: Joi.string().max(100).required(),
    types: Joi.string().max(100).required(),
    steps: Joi.string().required(),
    result: Joi.string().max(100).required(),
    division: Joi.string().max(100).required(),
  });
  static budget = Joi.object({
    id: Joi.string().required(),
    productCategory: Joi.string().required(),
    product: Joi.string().required(),
    amount: Joi.number().required(),
    priceUnit: Joi.number().optional(),
    priceTotal: Joi.number().optional(),
  });
  static schedules = Joi.object({
    id: Joi.string().required(),
    employee: Joi.string().required(),
    role: Joi.string().max(100).required(),
    created: Joi.date().required(),
    ended: Joi.date().required(),
  });
}

export class Document {
  static list = async (req: Request, res: Response): Promise<void> => {
    try {
      const record = await prisma.document.findMany();
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
  static viewDetail = async (req: Request, res: Response) => {
    try {
      const { title } = req.params;
      const record = await prisma.document.findFirst({
        where: {
          title: title,
        },
        include: {
          detail: true,
          attribute: true,
          riskassessment: true,
          testcase: true,
          budget: true,
          schedule: {
            include: {
              employee: true,
            },
          },
        },
      });
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
  static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = ValidateDocument.create.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }

      const { title, state } = req.body;

      const existingDocument = await prisma.document.findUnique({
        where: { title },
      });
      if (existingDocument) {
        res.status(400).json({ error: "Document already exists" });
      }
      const document = await prisma.document.create({
        data: {
          title,
          state: state.toUpperCase(),
          id: uuidv4(),
        },
      });

      res.status(201).json({
        success: true,
        data: document,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        data: error,
      });
    }
  };
  static detail = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateDocument.detail.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }
      const { intro, aim, documentId } = req.body;
      const record = await prisma.documentDetail.create({
        data: {
          intro,
          aim,
          documentId: documentId,
        },
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
  static attribute = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateDocument.attribute.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }
      const { categoryMain, category, value, id } = req.body;
      const record = await prisma.documentAttribute.create({
        data: {
          categoryMain: categoryMain,
          category: category,
          value: value,
          documentId: id,
        },
      });
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
  static risk = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateDocument.risk.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }
      const {
        id,
        riskDescription,
        riskLevel,
        affectionLevel,
        mitigationStrategy,
      } = req.body;
      const record = await prisma.riskAssessment.create({
        data: {
          riskDescription: riskDescription,
          riskLevel: riskLevel,
          affectionLevel: affectionLevel,
          mitigationStrategy: mitigationStrategy,
          documentId: id,
        },
      });
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
  static testcase = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateDocument.testcase.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }
      const { id, category, types, steps, result, division } = req.body;
      const record = await prisma.testCase.create({
        data: {
          category: category,
          types: types,
          steps: steps,
          result: result,
          division: division,
          documentId: id,
        },
      });
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
  static budget = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateDocument.budget.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }
      const { id, productCategory, product, amount, priceTotal, priceUnit } =
        req.body;
      const record = await prisma.documentBudget.create({
        data: {
          productCategory: productCategory,
          product: product,
          amount: amount,
          priceTotal: priceTotal,
          priceUnit: priceUnit,
          documentId: id,
        },
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
  static schedules = async (req: Request, res: Response) => {
    try {
      const { error } = ValidateDocument.schedules.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
      }
      const { employee, role, created, ended, id } = req.body;
      const findemployee = await prisma.employee.findFirst({
        where: {
          lastname: employee,
        },
      });
      if (!findemployee) {
        res.status(404).json({ error: "Employee not found" });
      }
      const finddocument = await prisma.document.findFirst({
        where: { id: id },
      });
      const record = await prisma.schedule.create({
        data: {
          role: role,
          created: new Date(created),
          ended: new Date(ended),
          employee: {
            connect: { id: findemployee?.id },
          },
          document: {
            connect: { id: finddocument?.id },
          },
        },
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
  static schedulelist = async (req: Request, res: Response) => {
    try {
      const record = await prisma.schedule.findMany();
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
  };
}
