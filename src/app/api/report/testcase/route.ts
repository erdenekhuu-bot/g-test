import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const testcase = request.category.map((item: any, index: number) => ({
      category: item,
      division: request.division[index],
      result: request.result[index],
      steps: request.steps[index],
      types: request.types[index],
      reportId: request.reportId,
    }));
    const record = await prisma.reportTestCase.createMany({
      data: testcase,
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
