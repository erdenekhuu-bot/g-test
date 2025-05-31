import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DocumentStateEnum } from "@prisma/client";

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
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
          id: Number(slug),
        },
        data: {
          state:
            request.access === 4
              ? DocumentStateEnum.ACCESS
              : DocumentStateEnum.REJECT,
        },
      }));

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
