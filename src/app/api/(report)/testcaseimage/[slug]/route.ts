import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    await prisma.testCaseImage.delete({
      where: {
        id: parseInt(slug),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: "Устгагдсан",
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
