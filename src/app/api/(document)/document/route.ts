import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { filterDepartment } from "@/components/usable";
import { DocumentStateEnum } from "@prisma/client";
import { filterEmployeeStat } from "@/lib/filtering";
import { DocumentSchema } from "@/util/validate";
import { safeParse } from "valibot";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();

    const validate = safeParse(DocumentSchema, request);
    if (!validate.success) {
      return NextResponse.json(
        {
          success: false,
          data: "Удирдамж буруу байна !!!",
        },
        {
          status: 404,
        }
      );
    }

    const record = await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: request.authuserId,
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });

      const initials = filterDepartment(authuser?.employee?.department?.name);
      const numbering = "-ТӨ-" + initials;
      const lastdocument = await tx.document.findFirst({
        orderBy: {
          generate: "desc",
        },
      });
      const lastNumber = lastdocument?.generate
        ? parseInt(lastdocument.generate.replace(numbering, ""), 10)
        : 0;
      const generate = String(lastNumber + 1).padStart(3, "0") + numbering;

      const record = await tx.document.create({
        data: {
          authUserId: authuser?.id,
          userDataId: authuser?.id,
          generate,
          state: DocumentStateEnum.DENY,
          title: request.title,
          detail: {
            create: {
              intro: request.intro,
              aim: request.aim,
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: request.departmentemployee,
            },
          },
        },
      });
      return record;
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
    const mhn = await Promise.all(
      request.departmentemployee.map(async (item: any) => {
        return {
          employeeId: await filterEmployeeStat(item.employeeId),
          role: item.role,
        };
      })
    );
    const record = await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: request.authuserId,
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });
      const initials = filterDepartment(authuser?.employee?.department?.name);
      const numbering = "-ТӨ-" + initials;
      const lastDocument = await tx.document.findFirst({
        orderBy: { generate: "desc" },
      });
      const lastNumber = lastDocument?.generate
        ? parseInt(lastDocument.generate.replace(numbering, ""), 10)
        : 0;

      const generate = String(lastNumber + 1).padStart(3, "0") + numbering;

      await tx.departmentEmployeeRole.deleteMany({
        where: { documentId: request.documentId },
      });
      await tx.documentDetail.deleteMany({
        where: { documentId: request.documentId },
      });
      const doc = await tx.document.update({
        where: { id: request.documentId },
        data: {
          authUserId: request.authuserId,
          userDataId: request.authuserId,
          generate,
          state: DocumentStateEnum.DENY,
          title: request.title,
          detail: {
            create: {
              intro: request.intro,
              aim: request.aim,
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: mhn,
            },
          },
        },
      });

      return doc;
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
