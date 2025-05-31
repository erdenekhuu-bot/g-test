import { DetailDocument } from "@/components/window/usable/detaildocument/page";
import { prisma } from "@/lib/prisma";
import { DefineLevel } from "@/lib/checkout";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ detail: number }>;
}) {
  const { detail } = await params;
  const record = await prisma.$transaction(async (tx) => {
    const data = await tx.document.findUnique({
      where: {
        id: Number(detail),
      },
      include: {
        documentemployee: {
          select: {
            employee: {
              select: {
                id: true,
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
          distinct: ["employeeId"],
          select: {
            employee: {
              include: {
                jobPosition: true,
                department: true,
                authUser: true,
              },
            },
            role: true,
            state: true,
            startedDate: true,
            endDate: true,
          },
          orderBy: {
            startedDate: "asc",
          },
        },
        attribute: true,
        detail: true,
        riskassessment: true,
        testcase: {
          orderBy: {
            id: "asc",
          },
          include: {
            testCaseImage: true,
          },
        },
        budget: true,
        file: true,
        report: {
          include: {
            budget: true,
            issue: true,
            team: true,
            testcase: true,
            file: true,
            usedphone: true,
          },
        },
      },
    });

    const steps = await tx.departmentEmployeeRole.findMany({
      where: { documentId: Number(detail) },
      distinct: ["employeeId"],
      include: {
        employee: {
          include: {
            jobPosition: {
              select: { jobPositionGroup: true },
            },
            department: true,
            authUser: true,
          },
        },
      },
    });

    const dataWithLevels = steps
      .map((item) => ({
        ...item,
        level: DefineLevel(
          item.employee?.jobPosition?.jobPositionGroup?.name || ""
        ),
      }))
      .sort((a, b) => b.level - a.level);
    return {
      data,
      steps: dataWithLevels,
    };
  });

  return <DetailDocument document={record.data} step={record.steps} />;
}
