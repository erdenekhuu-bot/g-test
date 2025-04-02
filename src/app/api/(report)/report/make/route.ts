import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    console.log(request);
    const record = await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: {
          id: request.authuserId,
        },
        include: {
          employee: true,
        },
      });
      const report = await tx.report.create({
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
          team: {
            createMany: {
              data: request.reportschedule,
              skipDuplicates: true,
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
      { status: 500 }
    );
  }
}
