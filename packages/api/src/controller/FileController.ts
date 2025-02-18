import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
const PDFDocument = require("pdfkit");
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
      testCaseId: id,
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

export const pdfdownload = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    const documentData = await prisma.document.findFirst({
      where: { id: parsedId },
      include: {
        user: {
          select: {
            employee: { select: { firstname: true, lastname: true } },
          },
        },
        detail: true,
        attribute: true,
        budget: true,
        riskassessment: true,
        testcase: {
          include: {
            testCaseDes: true,
            testCaseImage: true,
          },
        },
        documentemployee: {
          include: {
            employee: { select: { firstname: true, lastname: true } },
            jobPosition: { select: { name: true } },
          },
        },
        test: {
          include: {
            employee: { select: { firstname: true, lastname: true } },
            jobPosition: { select: { name: true } },
            department: { select: { name: true } },
          },
        },
      },
    });

    if (!documentData) {
      res.status(404).json({ success: false, message: "Баримт олдсонгүй" });
      return;
    }

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, "output.pdf");
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    const fontPath = path.resolve("fonts", "arial.ttf");
    if (!fs.existsSync(fontPath)) {
      res.status(500).json({ success: false, message: "Фонт олдсонгүй" });
      return;
    }

    doc.registerFont("MongolianFont", fontPath);

    doc
      .font("MongolianFont")
      .fontSize(14)
      .text(
        `"ЖИМОБАЙЛ"ХХК                                                                ${documentData.generate}`
      );
    const text = documentData.title;

    // Calculate the width of the text to center it
    const textWidth = doc.widthOfString(text);

    // Get the page width (assuming letter-size paper size, change as needed)
    const pageWidth = doc.page.width;

    // Set the starting x position to center the text
    const x = (pageWidth - textWidth) / 2;

    doc.moveDown(0.5);
    doc.font("MongolianFont").fontSize(20).text(text, x, doc.y);

    doc.moveDown(1);
    doc
      .fontSize(12)
      .text(`ЗОРИЛГО: ${documentData.detail[0].intro}`, 50, doc.y);

    doc
      .font("MongolianFont")
      .fontSize(12)
      .text(`${documentData.documentemployee}`)
      .moveDown(0.5);
    doc.text(`${documentData.generate}`);

    doc.end();

    stream.on("finish", () => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
      res.download(filePath, "document.pdf", (err) => {
        if (err) console.error("PDF татаж авахад алдаа гарлаа:", err);
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};
