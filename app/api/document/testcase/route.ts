import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/action/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const id = parseInt(url.searchParams.get("id") || "0", 10);
    const records = await prisma.testCase.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        documentId: id,
      },
    });
    const total = await prisma.testCase.count({
      where: {
        documentId: id,
      },
    });
    return NextResponse.json(
      { success: true, data: records, total },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
