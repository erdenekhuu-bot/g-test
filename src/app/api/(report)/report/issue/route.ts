import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const report = await tx.report.update({
        where: {
          id: request.reportId,
        },
        data: {
          reportadvice: request.reportadvice,
          reportconclusion: request.reportconclusion,
          issue: {
            createMany: {
              data: request.reporttesterror,
            },
          },
          budget: {
            createMany: {
              data: request.reportbudget,
            },
          },
        },
      });
      return report;
    });

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      {
        status: 500,
      }
    );
  }
}
