import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

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
          select: {
            // employee: {
            //   select: {
            //     firstname: true,
            //     lastname: true,
            //     jobPosition: true,
            //   },
            employee: {
              include: {
                authUser: true,
              },
            },
            role: true,
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

const middle = (arg: number) => {
  switch (arg) {
    case 0:
      return "DENY";
    case 1:
      return "FORWARD";
    case 2:
      return "ACCESS";
    default:
      return "DENY";
  }
};

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const { slug } = await params;
    const request = await req.json();
    const detail = await prisma.document.update({
      where: {
        id: parseInt(slug),
      },
      data: {
        state: middle(request.reject),
      },
    });

    return NextResponse.json({ success: true, data: detail });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
