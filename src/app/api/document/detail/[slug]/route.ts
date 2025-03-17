import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CheckErp } from "@/modules/level";
import { DocumentStateEnum } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;

    const record = await prisma.document.findUnique({
      where: {
        id: parseInt(slug),
      },
      include: {
        documentemployee: {
          select: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
                jobPosition: true,
                department: true,
              },
            },
            role: true,
            startedDate: true,
            endDate: true,
          },
        },
        departmentEmployeeRole: {
          include: {
            employee: true,
          },
        },
        attribute: true,
        detail: true,
        riskassessment: true,
        testcase: {
          include: {
            testCaseImage: true,
          },
        },
        budget: true,
        file: true,
        report: {
          include: {
            issue: true,
            team: true,
            testcase: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const request = await req.json();
    const authuser = await prisma.authUser.findUnique({
      where: {
        id: request.authuserId,
      },
      include: {
        employee: true,
      },
    });
    const trigger = await prisma.departmentEmployeeRole.update({
      where: {
        employeeId: authuser?.employee?.id,
      },
      data: {
        state: DocumentStateEnum.ACCESS,
      },
    });
    await prisma.document.update({
      where: {
        id: parseInt(slug),
      },
      data: {
        state: request.reject === 0 ? "DENY" : "FORWARD",
      },
    });
    return NextResponse.json({ success: true, data: trigger });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: error });
  }
}
