import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const employee = await prisma.employee.findMany({
      where: {
        AND: [
          {
            isDeleted: false,
          },
          {
            firstname: {
              contains: request.firstname || "",
              mode: "insensitive",
            },
          },
          {
            jobPosition: {
              jobPositionGroup: {
                isNot: null,
              },
            },
          },
        ],
      },
      include: {
        jobPosition: {
          include: {
            jobPositionGroup: true,
          },
        },
      },
    });

    const totalEmployee = await prisma.employee.count();
    return NextResponse.json(
      {
        success: true,
        data: employee,
        total: totalEmployee,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      {
        status: 500,
      }
    );
  }
}
