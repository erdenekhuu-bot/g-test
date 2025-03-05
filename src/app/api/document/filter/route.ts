import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { pages } from "next/dist/build/templates/app-page";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const page = request.page;
    const pageSize = request.pageSize;
    const record = await prisma.document.findMany({
      where: {
        generate: {
          contains: request.order,
        },
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
      },
      orderBy: {
        timeCreated: "asc",
      },
    });
    const totalPage = await prisma.document.count();
    return NextResponse.json({
      success: true,
      data: record,
      pagination: { page: page, pageSize: pageSize, total: totalPage },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
