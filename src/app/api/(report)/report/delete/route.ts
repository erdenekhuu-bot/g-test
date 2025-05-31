import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const request = await req.json();
    await prisma.report.delete({
      where: {
        id: request.reportId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: "Тайлан устгагдсан",
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
