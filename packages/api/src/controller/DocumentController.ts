import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ValidateExpression } from "../schema/validation";

const prisma = new PrismaClient();

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const record = await prisma.document.findMany({
      include: {
        userData: true,
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
export const viewDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title } = req.params;
    const record = await prisma.document.findFirst({
      where: {
        title: title,
      },
      include: {
        attribute: true,
        riskassessment: true,
        testcase: true,
        budget: true,
        userData: true,
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
export const create = async (req: Request, res: Response) => {
  try {
    const { error } = ValidateExpression.create.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    }

    const { title, state, employee, intro, aim, jobposition } = req.body;

    const existingDocument = await prisma.document.findUnique({
      where: {
        title,
      },
    });
    if (existingDocument) {
      res.status(400).json({ error: "Document already exists" });
    }
    const findEmployee = await prisma.employee.findFirst({
      where: {
        firstname: employee.split(" ")[0].substring(2),
      },
      include: {
        jobPosition: true,
      },
    });
    const permission = await prisma.userData.findUnique({
      where: {
        authUserId: parseInt((findEmployee?.authUserId ?? "0").toString()),
      },
    });
    const document = await prisma.document.create({
      data: {
        title,
        state: state.toUpperCase(),
        id: uuidv4(),
        userDataId: permission?.authUserId,
      },
    });

    const detail = await prisma.documentDetail.create({
      data: {
        intro: intro,
        aim: aim,
        documentId: document.id,
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
export const attribute = async (req: Request, res: Response) => {
  try {
    const { error } = ValidateExpression.attribute.validate(req.body);
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
export const risk = async (req: Request, res: Response) => {
  try {
    const { error } = ValidateExpression.risk.validate(req.body);
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
export const testcase = async (req: Request, res: Response) => {
  try {
    const { error } = ValidateExpression.testcase.validate(req.body);
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
export const budget = async (req: Request, res: Response) => {
  try {
    const { error } = ValidateExpression.budget.validate(req.body);
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
export const schedules = async (req: Request, res: Response) => {
  try {
    const { error } = ValidateExpression.schedules.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    }
    const { employee, role, created, ended, id } = req.body;
    const findemployee = await prisma.employee.findFirst({
      where: {
        firstname: employee.split(" ")[0],
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

export const setMiddle = async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    const record = await prisma.document.update({
      where: {
        title: title,
      },
      data: {
        state: "FORWARD",
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

export const setTrigger = async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    let record = await prisma.document.findUnique({
      where: {
        title: title,
      },
    });

    if (record?.state != "FORWARD") {
      res.json({
        success: false,
        data: "Didn't viewed",
      });
    }

    record = await prisma.document.update({
      where: {
        title: title,
      },
      data: {
        state: "ACCESS",
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
