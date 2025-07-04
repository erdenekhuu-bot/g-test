import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { convertName } from "@/components/usable";
import { Prisma } from "@prisma/client";
import { Checking } from "@/lib/enum";

export async function PATCH(req: NextRequest) {
  try {
    const request = await req.json();
    const user = await prisma.authUser.findUnique({
      where: { id: request.userId },
      select: {
        employee: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });
    const body = {
      employee: convertName(user?.employee),
      rejection: request.rejection,
    };

    const record = await prisma.document.update({
      where: {
        id: request.documentId,
      },
      data: {
        state: Checking(request.cause),
        rejection: body as Prisma.JsonObject,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      {
        status: 500,
      }
    );
  }
}
