import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const record = await prisma.$transaction(async (tx) => {
      const document = await tx.document.findUnique({
        where: { id: request.detailId },
        include: { testcase: true },
      });

      const testCaseIds = document?.testcase.map((tc) => tc.id);

      if (testCaseIds && testCaseIds.length > 0) {
        await tx.report.update({
          where: { id: request.reportId },
          data: {
            testcase: {
              connect: testCaseIds.map((testCaseId) => ({ id: testCaseId })),
            },
            usedphone: {
              createMany: {
                data: request.usedphone,
              },
            },
          },
        });
      }
      const updatedReport = await tx.report.findUnique({
        where: { id: request.reportId },
        include: { testcase: true },
      });

      return updatedReport;
    });

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
