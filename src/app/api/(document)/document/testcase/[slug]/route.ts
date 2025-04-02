import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const record = await prisma.testCase.findUnique({
      where: {
        id: parseInt(slug),
      },
      include: {
        testCaseImage: true,
        document: {
          select: {
            documentemployee: {
              select: {
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
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const request = await req.json();
    const record = await prisma.testCase.update({
      where: {
        id: parseInt(slug),
      },
      data: {
        testType: request.action,
        description: request.description,
      },
    });

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
