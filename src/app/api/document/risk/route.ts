import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const risk = request.affectionLevel.map((item: any, index: number) => ({
      affectionLevel: item,
      mitigationStrategy: request.mitigationStrategy[index],
      riskDescription: request.riskDescription[index],
      riskLevel: request.riskLevel[index],
      documentId: request.documentId,
    }));
    const record = await prisma.riskAssessment.createMany({
      data: risk,
      skipDuplicates: true,
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
