import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: any) {
  try {
    const { slug } = await params;

    const record = await prisma.document.findUnique({
      where: {
        id: slug,
      },
      include: {
        attribute: true,
        detail: true,
        documentemployee: true,
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
