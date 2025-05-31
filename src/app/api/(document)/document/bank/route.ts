import { NextResponse, NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const bankData = {
      name: request.bankname,
      address: request.bank,
    };

    const record = await prisma.document.update({
      where: {
        id: request.documentId,
      },
      data: {
        bank: bankData as Prisma.JsonObject,
      },
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
    const bankData = {
      name: request.bankname,
      address: request.bank,
    };

    const record = await prisma.document.update({
      where: {
        id: request.documentId,
      },
      data: {
        bank: bankData as Prisma.JsonObject,
      },
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
      { status: 500 }
    );
  }
}
