import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { filterDepartment } from "@/components/usable";
import { DocumentStateEnum } from "@prisma/client";
import { Checking } from "@/lib/enum";
import { filterEmployee } from "@/lib/filtering";
import { DocumentSchema } from "@/util/validate";
import { safeParse } from "valibot";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const validate = safeParse(DocumentSchema, request);
    if (!validate.success) {
      return NextResponse.json(
        {
          success: false,
          data: "Таарсангүй",
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
              skipDuplicates: true,
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
          employeeId: await filterEmployee(item.employeeId),
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
          title: request.title || {},
          detail: {
            create: {
              intro: request.intro || {},
              aim: request.aim || {},
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: mhn,
              skipDuplicates: true,
            },
          },
        },
      });

      return doc;
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const request = await req.json();
    const record = await prisma.$transaction(async (tx) => {
      const checkout = await prisma.authUser.findUnique({
        where: {
          id: request.authuserId,
        },
        include: {
          employee: true,
        },
      });

      const checking = await prisma.departmentEmployeeRole.update({
        where: {
          employeeId_documentId: {
            employeeId: Number(checkout?.employee?.id),
            documentId: Number(request.documentId),
          },
        },
        data: {
          state: DocumentStateEnum.ACCESS,
        },
      });

      const updating =
        checking &&
        (await prisma.document.update({
          where: {
            id: request.documentId,
          },
          data: {
            state: Checking(request.reject),
          },
        }));
      return updating;
    });
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ success: false, data: error });
  }
}
