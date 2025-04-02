import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        data: "Deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}
