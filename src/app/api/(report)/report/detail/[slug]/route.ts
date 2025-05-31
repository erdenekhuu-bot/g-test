import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const record = await prisma.$transaction(async (tx) => {
      const detail = await tx.document.findUnique({
        where: {
          id: parseInt(slug),
        },
        include: {
          documentemployee: {
            select: {
              employee: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  jobPosition: true,
                  department: true,
                },
              },
              role: true,
              startedDate: true,
              endDate: true,
            },
          },
          budget: true,
          report: {
            include: {
              issue: true,
              budget: true,
              team: true,
              testcase: {
                include: {
                  testCaseImage: true,
                },
              },
              employee: {
                include: {
                  jobPosition: true,
                  department: true,
                },
              },
              documentEmployee: true,
              file: true,
              usedphone: true,
            },
          },
        },
      });
      return detail;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
