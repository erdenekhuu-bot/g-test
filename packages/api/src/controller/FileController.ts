import { Request, Response } from "express";
import path from "path";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const saveImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: "No images provided" });
    }

    const imagesData = files.map((file) => ({
      path: file.path,
      testcaseId: id,
    }));

    const result = await prisma.testCaseImage.createMany({
      data: imagesData,
      skipDuplicates: true,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const saveFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const check = await prisma.testCase.findUnique({
      where: {
        id: id,
      },
    });
    const file = req.file;

    if (file) {
      if (check) {
        const statement = path.parse(file.originalname).name;
        const savedFile = await prisma.file.create({
          data: {
            fileName: file.originalname,
            path: file.path,
            testCaseId: check.id,
          },
        });

        if (check.documentId) {
          await prisma.document.update({
            where: { id: check.documentId },
            data: { statement: statement },
          });
        }

        res.json({
          success: true,
          data: savedFile,
          document: "Statement success",
        });
      } else {
        res.status(404).json({ error: "testcase id not found" });
      }
    } else {
      res.status(400).json({ error: "Файл оруулна уу" });
    }
  } catch {
    res.status(500).json({ error: "Файлыг хадгалахад алдаа гарлаа" });
  }
};
