import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";

const prisma = new PrismaClient();

export const config = {
  runtime: "edge",
};

export async function GET(req: NextRequest) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: 54 },
      include: {
        user: {
          select: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
                jobPosition: true,
                department: true,
              },
            },
          },
        },
        detail: true,
        attribute: true,
        budget: true,
        riskassessment: true,
        testcase: {
          include: {
            testCaseImage: true,
          },
        },
        documentemployee: {
          select: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
                jobPosition: true,
              },
            },
            role: true,
            startedDate: true,
            endDate: true,
          },
        },
        report: {
          include: {
            issue: true,
            team: true,
            testcase: true,
          },
        },
      },
    });

    if (!document) {
      return new NextResponse(
        JSON.stringify({ message: "Document not found" }),
        { status: 404 }
      );
    }

    const templatePath = path.join(
      process.cwd(),
      "public/templates",
      "document.ejs"
    );
    const htmlContent = await ejs.renderFile(templatePath, { document });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=document.pdf",
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
