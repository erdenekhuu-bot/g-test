import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const request = await req.json();
    await prisma.report.update({
      where: {
        id: request.reportId,
      },
      data: {
        reportadvice: request.reportadvice,
        reportconclusion: request.reportconclusion,
      },
    });
    const issueData = request.list.map((item: any, index: number) => ({
      list: item,
      level: request.level[index],
      value: request.value[index],
      reportId: request.reportId,
    }));
    const record = await prisma.reportIssue.createMany({
      data: issueData,
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
