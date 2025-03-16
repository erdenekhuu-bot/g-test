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
      documentId: request.documentId,
    }));
    const record = await prisma.testCase.createMany({
      data: testcase,
      skipDuplicates: true,
    });
    await prisma.document.update({
      where: {
        id: request.documentId,
      },
      data: {
        isFull: 2,
      },
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

export async function DELETE(req: NextRequest) {
  try {
    const request = await req.json();
    await prisma.testCase.deleteMany();
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
