import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const team = request.role.map((item: any, index: number) => ({
      role: item,
      employeeId: request.employeeId[index],
      endDate: request.endDate[index],
      startedDate: request.startedDate[index],
      documentId: request.documentId,
    }));
    const record = await prisma.documentEmployee.createMany({
      data: team,
      skipDuplicates: true,
    });
    await prisma.document.update({
      where: {
        id: request.documentId,
      },
      data: {
        isFull: 1,
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
