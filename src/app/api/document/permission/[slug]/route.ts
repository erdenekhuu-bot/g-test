import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const request = await req.json();
    const checkout = await prisma.document.findUnique({
      where: {
        id: parseInt(slug),
      },
      select: {
        id: true,
        state: true,
      },
    });

    if (checkout?.state != "FORWARD") {
      return NextResponse.json({ success: false, data: "Хянагдаагүй байна" });
    }

    const access =
      checkout &&
      (await prisma.document.update({
        where: {
          id: checkout.id,
        },
        data: {
          state: request.access != true ? "REJECT" : "ACCESS",
        },
      }));

    return NextResponse.json({ success: true, data: access });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
