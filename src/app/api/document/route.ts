import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { filterDepartment } from "@/components/usable";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const authuser = await prisma.authUser.findUnique({
      where: {
        id: request.authuserId,
      },
    });
    const employee =
      authuser &&
      (await prisma.employee.findUnique({
        where: {
          authUserId: authuser.id,
        },
        include: {
          department: true,
        },
      }));

    const initials = filterDepartment(employee?.department?.name);
    const numbering = "-ТӨ-" + initials;
    const lastdocument = await prisma.document.findFirst({
      orderBy: {
        generate: "desc",
      },
    });

    const lastNumber = lastdocument?.generate
      ? parseInt(lastdocument.generate.replace(numbering, ""), 10)
      : 0;

    const generate = String(lastNumber + 1).padStart(3, "0") + numbering;

    const record =
      authuser &&
      (await prisma.document.create({
        data: {
          authUserId: authuser.id,
          userDataId: authuser.id,
          generate,
          state: "DENY",
          title: request.title,
          detail: {
            create: {
              intro: request.intro || {},
              aim: request.aim || {},
            },
          },
        },
      }));

    if (!record) {
      return NextResponse.json({
        success: false,
        data: "Тестийн удирдамж үүссэнгүй",
      });
    }

    const employeerole =
      record &&
      request.employeeId.map((employeeId: number, index: number) => ({
        role: request.role[index],
        employeeId,
        jobPositionId: request.jobPositionId[index],
        documentId: record.id,
      }));
    await prisma.departmentEmployeeRole.createMany({
      data: employeerole,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      data: error,
    });
  }
}
