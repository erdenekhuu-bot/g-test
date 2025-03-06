import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const record = await prisma.report.create({
      data: {
        reportname: request.reportname,
        reportpurpose: request.reportpurpose,
        reportprocessing: request.reportprocessing,
      },
    });
    const teamsData = request.name.map((item: any, index: number) => ({
      name: item,
      role: request.role[index],
      started: request.started[index],
      ended: request.ended[index],
      reportId: record.id,
    }));

    const report = await prisma.reportTeam.createMany({
      data: teamsData,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      data: report,
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
