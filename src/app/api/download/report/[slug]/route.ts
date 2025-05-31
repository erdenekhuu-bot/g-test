import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";
import ejs from "ejs";
import fs from "fs";
import path from "path";

export const config = {
  runtime: "nodejs",
};

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = params;
    const record = await prisma.$transaction(async (tx) => {
      const detail = await tx.document.findUnique({
        where: {
          id: parseInt(slug),
        },
        include: {
          documentemployee: {
            select: {
              employee: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  jobPosition: true,
                  department: true,
                },
              },
              role: true,
              startedDate: true,
              endDate: true,
            },
          },
          budget: true,
          report: {
            include: {
              budget: true,
              issue: true,
              team: true,
              testcase: {
                where: {
                  testType: "ENDED",
                },
                orderBy: {
                  id: "asc",
                },
                include: {
                  testCaseImage: true,
                },
              },
              employee: {
                include: {
                  jobPosition: true,
                  department: true,
                },
              },
              file: true,
              usedphone: true,
            },
          },
        },
      });
      return detail;
    });
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "report.ejs"
    );
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const htmlContent = ejs.render(templateContent, { record });

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "10mm",
        bottom: "10mm",
      },
      printBackground: true,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=testiin_tailan_${slug}.pdf`,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}
