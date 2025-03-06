import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const attributeData = request.attribute.map((attribute: any) => ({
      categoryMain: attribute.categoryMain,
      category: attribute.category,
      value: attribute.value,
      documentId: attribute.documentId,
    }));
    const createdAttributes = await prisma.documentAttribute.createMany({
      data: attributeData,
      skipDuplicates: true,
    });
    return NextResponse.json({
      success: true,
      data: createdAttributes,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
