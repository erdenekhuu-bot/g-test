import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const record = await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: {
          id: request.authuserId,
        },
        include: {
          employee: true,
        },
      });

      const existingReport = await tx.report.findUnique({
        where: {
          documentId: request.documentId,
        },
      });

      let report;

      if (existingReport) {
        report = await tx.report.update({
          where: {
            documentId: request.documentId,
          },
          data: {
            reportname: request.reportname,
            reportpurpose: request.reportpurpose,
            reportprocessing: request.reportprocessing,
            employee: {
              connect: {
                id: user?.employee?.id,
              },
            },
          },
        });
      } else {
        report = await tx.report.create({
          data: {
            reportname: request.reportname,
            reportpurpose: request.reportpurpose,
            reportprocessing: request.reportprocessing,
            document: {
              connect: {
                id: request.documentId,
              },
            },
            employee: {
              connect: {
                id: user?.employee?.id,
              },
            },
          },
        });
      }

      return report;
    });

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
