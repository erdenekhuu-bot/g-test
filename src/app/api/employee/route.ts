import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const page = 1;
    const pageSize = 100;
    const employee = await prisma.employee.findMany({
      where: {
        isDeleted: false,
        firstname: {
          contains: request.firstname,
        },
      },
      include: {
        jobPosition: true,
        department: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalEmployee = await prisma.employee.count();
    return NextResponse.json({
      success: true,
      data: employee,
      total: totalEmployee,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
