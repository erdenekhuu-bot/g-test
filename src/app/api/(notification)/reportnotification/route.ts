import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const data = await tx.authUser.findUnique({
        where: {
          id: Number(request.authUser),
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });
      const result =
        data &&
        (await tx.report.update({
          where: {
            id: request.reportId,
          },
          data: {
            rode: true,
          },
        }));
      return result;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
