import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const page = request.page;
    const pageSize = request.pageSize;
    const filter = await prisma.document.findMany({
      where: {
        AND: [
          {
            state: "FORWARD",
          },
          {
            generate: {
              contains: request.order,
            },
          },
        ],
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        file: true,
      },
      orderBy: {
        timeCreated: "asc",
      },
    });
    const totalPage = filter.length;
    return NextResponse.json({
      success: true,
      data: filter,
      pagination: { page: page, pageSize: pageSize, total: totalPage },
    });
  } catch (error) {
    return NextResponse.json({ success: false, data: error });
  }
}
