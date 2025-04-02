import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
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
          departmentEmployeeRole: {
            select: {
              employee: {
                include: {
                  jobPosition: true,
                  department: true,
                },
              },
              role: true,
              state: true,
              timeCreated: true,
              timeUpdated: true,
            },
          },
          attribute: true,
          detail: true,
          riskassessment: true,
          testcase: {
            include: {
              testCaseImage: true,
            },
          },
          budget: true,
          file: true,
          report: {
            include: {
              issue: true,
              team: true,
              testcase: true,
              file: true,
            },
          },
        },
      });
      return detail;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
