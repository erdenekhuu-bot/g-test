import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const record = await prisma.report.create({
      data: {
        reportname: request.reportname,
        reportpurpose: request.reportpurpose,
        reportprocessing: request.reportprocessing,
        document: {
          connect: {
            id: request.documentId,
          },
        },
      },
    });

    const teamsData = request.name.map((item: any, index: number) => ({
      name: item,
      role: request.role[index],
      started: request.started[index],
      ended: request.ended[index],
      reportId: record.id,
    }));

    await prisma.reportTeam.createMany({
      data: teamsData,
      skipDuplicates: true,
    });
    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}

export async function GET() {
  try {
    const record = await prisma.report.findMany({});
    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
