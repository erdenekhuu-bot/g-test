import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;

    const record = await prisma.document.findUnique({
      where: {
        id: parseInt(slug),
      },
      include: {
        documentemployee: {
          select: {
            employee: true,
          },
        },
        attribute: true,
        detail: true,
        riskassessment: true,
        testcase: true,
        budget: true,
      },
    });
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const request = await req.json();
    const detail = await prisma.document.update({
      where: {
        id: parseInt(slug),
      },
      data: {
        state: request.reject != true ? "FORWARD" : "DENY",
      },
    });

    return NextResponse.json({ success: true, data: detail });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
