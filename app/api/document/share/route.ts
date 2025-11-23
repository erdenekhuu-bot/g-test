import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/action/prisma";

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const paper = await tx.shareGroup.findMany({
        where: {
          documentId: Number(request.id),
        },
        select: {
          employee: true,
        },
      });
      return paper;
    });
    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
