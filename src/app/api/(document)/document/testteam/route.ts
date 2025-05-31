import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { filterEmployee } from "@/lib/filtering";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const customrelation = request
      .map((item: any) => {
        if (item.role === "Хяналт тавих, Асуудал шийдвэрлэх") {
          return { ...item, role: "VIEWER" };
        }
        return null;
      })
      .filter((item: any) => item !== null);
    const record = await prisma.$transaction(async (tx) => {
      const testteam = await tx.documentEmployee.createMany({
        data: request,
      });
      await tx.departmentEmployeeRole.createMany({
        data: customrelation,
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
    const documentId = request[0].documentId;

    const processedItems = await Promise.all(
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
            role: item.role,
            startedDate: item.startedDate,
            endDate: item.endDate,
            documentId: item.documentId,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      })
    );

    const validItems = processedItems.filter(
      (item): item is NonNullable<typeof item> => item !== null
    );

    if (validItems.length === 0) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const customrelation = validItems
      .map((item: any) => {
        if (item.role === "Хяналт тавих, Асуудал шийдвэрлэх") {
          return { ...item, role: "VIEWER" };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const record = await prisma.$transaction(async (tx) => {
      await tx.documentEmployee.deleteMany({
        where: { documentId: documentId },
      });

      if (customrelation.length > 0) {
        await tx.departmentEmployeeRole.createMany({
          data: customrelation,
        });
      }

      const updating = await tx.documentEmployee.createMany({
        data: validItems,
      });

      await tx.document.update({
        where: {
          id: documentId,
        },
        data: {
          isFull: 1,
        },
      });
      return updating;
    });

    return NextResponse.json({ success: true, data: record }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
