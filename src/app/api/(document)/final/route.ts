import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DocumentStateEnum } from "@prisma/client";
import { Checking } from "@/lib/enum";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const authuser = await prisma.authUser.findUnique({
      where: {
        id: request.authuserId,
      },
      include: {
        employee: true,
      },
    });

    const record =
      authuser &&
      (await prisma.document.update({
        where: {
          id: parseInt(request.documentId),
        },
        data: {
          state: Checking(request.reject),
        },
      }));

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ success: false, data: error });
  }
}
