import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const record = await prisma.shareGroup.findMany({
      where: {
        documentId: Number(slug),
      },
      include: {
        employee: true,
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}
