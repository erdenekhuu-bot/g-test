import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const record = await prisma.$transaction(async (tx) => {
      const testcase = await tx.testCase.createMany({
        data: request,
        skipDuplicates: true,
      });

      await tx.document.update({
        where: {
          id: request[0].documentId,
        },
        data: {
          isFull: 2,
        },
      });
      return testcase;
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
      await tx.testCase.deleteMany({
        where: { documentId: request[0].documentId },
      });

      const testcase = await tx.testCase.createMany({
        data: request || [],
        skipDuplicates: true,
      });

      await tx.document.update({
        where: {
          id: request[0].documentId,
        },
        data: {
          isFull: 2,
        },
      });

      return testcase;
    });
    return NextResponse.json(
      {
        success: true,
        data: record,
      },
      { status: 200 }
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
