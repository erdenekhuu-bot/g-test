import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Checking } from "@/lib/enum";

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const document = await tx.shareGroup.findFirst({
        where: {
          documentId: request.documentId,
        },
      });
      if (!document) {
        await tx.shareGroup.createMany({
          data: request.sharegroup,
        });
      }
      await tx.shareGroup.deleteMany({
        where: {
          documentId: request.documentId,
        },
      });
      const result = await tx.shareGroup.createMany({
        data: request.sharegroup,
      });

      await tx.document.update({
        where: {
          id: request.documentId,
        },
        data: {
          state: Checking(request.share),
        },
      });
      return result;
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
