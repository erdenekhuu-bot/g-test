import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const record = await prisma.$transaction(async (tx) => {
      const updating = await tx.documentAttribute.createMany({
        data: request.attributeData,
      });
      await tx.document.update({
        where: { id: request.attributeData[0].documentId },
        data: { isFull: 1 },
      });

      return updating;
    });

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
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

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      await tx.documentAttribute.deleteMany({
        where: {
          documentId: parseInt(request[0].documentId),
        },
      });

      const updating = await tx.documentAttribute.createMany({
        data: request,
      });

      return updating;
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
