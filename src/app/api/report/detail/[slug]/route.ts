import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const record = await prisma.report.findUnique({
      where: {
        id: parseInt(slug),
      },
      include: {
        team: true,
        issue: true,
        testcase: true,
        document: true,
      },
    });
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
