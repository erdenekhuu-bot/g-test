import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DefineLevel, filterByPermissionLevels } from "@/lib/checkout";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const data = await prisma.authUser.findUnique({
      where: {
        id: request.id,
      },
      include: {
        employee: true,
      },
    });
    const record = await prisma.departmentEmployeeRole.findMany({
      distinct: ["employeeId"],
      include: {
        employee: {
          include: {
            jobPosition: {
              select: {
                jobPositionGroup: true,
              },
            },
          },
        },
        document: true,
      },
    });
    const dataWithLevels = record.map((item) => ({
      ...item,
      level: DefineLevel(
        item.employee?.jobPosition?.jobPositionGroup?.name || ""
      ),
    }));
    const filteredData = filterByPermissionLevels(dataWithLevels).filter(
      (item: any) => item.employeeId === data?.employee?.id
    );

    return NextResponse.json(
      {
        success: true,
        data: filteredData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}
