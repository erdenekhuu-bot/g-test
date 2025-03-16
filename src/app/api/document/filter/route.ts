import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const page = request.page;
    const pageSize = request.pageSize;

    const employee = await prisma.authUser.findUnique({
      where: {
        id: request.authId,
      },
      include: {
        employee: true,
      },
    });

    const record =
      employee &&
      (await prisma.departmentEmployeeRole.findMany({
        where: {
          AND: [
            {
              document: {
                generate: {
                  contains: request.order,
                  mode: "insensitive",
                },
              },
            },
            {
              employeeId: employee.employee?.id,
            },
          ],
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          document: true,
        },
      }));
    const totalPage = await prisma.document.count();
    return NextResponse.json({
      success: true,
      data: record,
      pagination: { page: page, pageSize: pageSize, total: totalPage },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
