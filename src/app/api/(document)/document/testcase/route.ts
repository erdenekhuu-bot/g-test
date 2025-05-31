import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const record = await prisma.$transaction(async (tx) => {
      const testcase = await tx.testCase.createMany({
        data: request,
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

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      await tx.testCase.deleteMany({
        where: { documentId: request[0].documentId },
      });

      const testcase = await tx.testCase.createMany({
        data: request,
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
