import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const record = await prisma.$transaction(async (tx) => {
      const data = await tx.authUser.findUnique({
        where: {
          id: Number(slug),
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });
      const list =
        data &&
        (await tx.employee.findMany({
          where: {
            AND: [
              {
                departmentId: data.employee?.department.id,
              },
              {
                isDeleted: false,
              },
            ],
          },
          include: {
            report: {
              where: {
                rode: false,
              },
            },
            jobPosition: true,
          },
        }));

      return list?.filter((item: any) => item.report.length);
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
