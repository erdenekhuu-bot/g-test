import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const employeeId = await prisma.employee.findUnique({
      where: {
        id: request?.employeeId,
      },
      include: {
        department: true,
        jobPosition: true,
      },
    });
    const record = await prisma.documentemployee.createMany({});
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
