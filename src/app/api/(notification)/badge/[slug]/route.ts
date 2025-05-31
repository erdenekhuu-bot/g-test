import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DefineLevel } from "@/lib/checkout";

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
      const filt = await tx.departmentEmployeeRole.findMany({
        distinct: ["documentId"],
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
        },
      });
      const dataWithLevels = filt.map((item) => ({
        ...item,
        level: DefineLevel(
          item.employee?.jobPosition?.jobPositionGroup?.name || ""
        ),
      }));
      const convert = dataWithLevels.filter(
        (item: any) => item.level < 4 || item.level > 6
      );

      const result = convert.every((item) => item.rode === true);

      const list = await tx.departmentEmployeeRole.findMany({
        where: {
          AND: [
            {
              employeeId: data?.employee?.id,
            },
            {
              rode: false,
            },
            {
              document: {
                AND: [
                  result ? { state: "FORWARD" } : { state: { not: "FORWARD" } },
                ],
              },
            },
          ],
        },
        distinct: ["documentId"],
      });
      return list;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
