import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DefineLevel } from "@/lib/checkout";
import { filterByPermissionLevels } from "@/lib/checkout";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;

    const record = await prisma.$transaction(async (tx) => {
      const data = await tx.authUser.findUnique({
        where: {
          id: Number(slug),
        },
        include: {
          employee: true,
        },
      });
      const list = await tx.departmentEmployeeRole.findMany({
        distinct: ["employeeId"],
        orderBy: {
          document: {
            timeCreated: "desc",
          },
        },
        where: {
          document: {
            state: "FORWARD",
          },
        },
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

      const dataWithLevels = list.map((item) => ({
        ...item,
        level: DefineLevel(
          item.employee?.jobPosition?.jobPositionGroup?.name || ""
        ),
      }));

      const filteredData = filterByPermissionLevels(dataWithLevels).filter(
        (item: any) =>
          item.employeeId === data?.employee?.id && item.rode === false
      );

      return filteredData;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
