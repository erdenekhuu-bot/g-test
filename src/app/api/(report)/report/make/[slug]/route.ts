import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const record = await prisma.report.findUnique({
      where: {
        id: parseInt(slug),
      },
      include: {
        issue: true,
        team: true,
        testcase: true,
        usedphone: true,
        budget: true,
        employee: true,
        file: true,
        document: {
          include: {
            documentemployee: {
              include: {
                employee: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
