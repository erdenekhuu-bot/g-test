import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { filterEmployee } from "@/lib/filtering";

export async function PUT(req: NextRequest) {
  try {
    const request = await req.json();
    const data = await Promise.all(
      request.map(async (item: any) => {
        try {
          const employeeId =
            typeof item.employeeId === "number"
              ? item.employeeId
              : await filterEmployee(item.employeeId);
          if (employeeId === undefined) {
            return null;
          }
          return {
            employeeId: employeeId,
            system: item.system,
            description: item.description,
            module: item.module,
            version: item.version,
            jobs: item.jobs,
            startedDate: item.startedDate,
            title: item.title,
            documentId: item.documentId,
          };
        } catch (error) {
          return null;
        }
      })
    );

    const record = await prisma.$transaction(async (tx) => {
      const document = await tx.confirmPaper.findFirst({
        where: {
          documentId: request.documentId,
        },
      });
      if (!document) {
        await tx.confirmPaper.createMany({
          data,
        });
      }
      await tx.confirmPaper.deleteMany({
        where: {
          documentId: request.documentId,
        },
      });
      await tx.confirmPaper.createMany({
        data: data,
      });
      return document;
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

export async function PATCH(req: Request) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: {
          id: request.authUser,
        },
        include: {
          employee: request.access > 0 ? true : false,
        },
      });
      const result = await tx.confirmPaper.update({
        where: {
          employeeId: user?.employee?.id,
        },
        data: {
          rode: true,
        },
      });
      return result;
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
