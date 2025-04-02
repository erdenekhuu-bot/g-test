import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const risk = await tx.riskAssessment.createMany({
        data: request,
        skipDuplicates: true,
      });

      await prisma.document.update({
        where: {
          id: request[0].documentId,
        },
        data: {
          isFull: 1,
        },
      });
      return risk;
    });

    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 201 }
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

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      await tx.riskAssessment.deleteMany({
        where: { documentId: request[0].documentId },
      });

      const updating = await tx.riskAssessment.createMany({
        data: request || [],
        skipDuplicates: true,
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
