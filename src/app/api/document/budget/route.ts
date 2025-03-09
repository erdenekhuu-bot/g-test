import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const budget = request.priceTotal.map((item: any, index: number) => ({
      priceTotal: item,
      priceUnit: request.priceUnit[index],
      product: request.product[index],
      productCategory: request.productCategory[index],
      documentId: request.documentId,
    }));
    const record = await prisma.documentBudget.createMany({
      data: budget,
      skipDuplicates: true,
    });
    await prisma.document.update({
      where: {
        id: request.documentId,
      },
      data: {
        isFull: 1,
      },
    });
    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
