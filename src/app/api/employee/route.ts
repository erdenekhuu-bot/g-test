import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { capitalizeFirstLetter } from "@/components/usable";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const employee = await prisma.$queryRaw`
      SELECT * FROM public."Employee" WHERE firstname LIKE ${`%${capitalizeFirstLetter(
        request.firstname
      )}%`} ORDER BY id ASC;`;

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
    console.log(error);
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
