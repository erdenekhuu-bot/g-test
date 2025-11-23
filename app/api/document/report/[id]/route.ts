import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/action/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.report.findUnique({
      where: { id: Number(id) },
      select: {
        document: {
          select: {
            documentemployee: {
              include: {
                employee: true,
              },
            },
            testcase: true,
            report: {
              include: {
                issue: true,
                usedphone: true,
              },
            },
            budget: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
