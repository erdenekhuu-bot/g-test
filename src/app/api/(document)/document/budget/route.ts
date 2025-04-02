import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    if (request != null) {
      return NextResponse.json(
        {
          success: true,
        },
        { status: 201 }
      );
    }
    const record = await prisma.$transaction(async (tx) => {
      const budget = await tx.documentBudget.createMany({
        data: request || [],
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
      return budget;
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
      if (request != null) {
        return NextResponse.json(
          {
            success: false,
          },
          { status: 404 }
        );
      }
      await tx.documentBudget.deleteMany({
        where: { documentId: request.documentId },
      });

      const updating = await tx.documentBudget.createMany({
        data: request || [],
        skipDuplicates: true,
      });

      return updating;
    });
    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
