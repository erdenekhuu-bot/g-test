import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { filterEmployee } from "@/lib/filtering";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    console.log(request);
    const record = await prisma.$transaction(async (tx) => {
      const testteam = await tx.documentEmployee.createMany({
        data: request,
        skipDuplicates: true,
      });
      await tx.document.update({
        where: {
          id: request[0].documentId,
        },
        data: {
          isFull: 1,
        },
      });
      return testteam;
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

    const mhn = await Promise.all(
      request.map(async (item: any) => {
        return {
          employeeId: await filterEmployee(item.employeeId),
          role: item.role,
          startedDate: item.startedDate,
          endDate: item.endDate,
          documentId: item.documentId,
        };
      })
    );

    const record = await prisma.$transaction(async (tx) => {
      await tx.documentEmployee.deleteMany({
        where: { documentId: request.documentId },
      });

      const updating = await tx.documentEmployee.createMany({
        data: mhn || [],
        skipDuplicates: true,
      });

      return updating;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
