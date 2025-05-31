import { prisma } from "@/lib/prisma";
import { ShareDocument } from "@/components/page/sharedocument/page";

export const dynamic = "force-dynamic";

export default async function Page({ params }: any) {
  const { share } = await params;

  const records = await prisma.$transaction(async (tx) => {
    const document = await prisma.document.findUnique({
      where: {
        id: parseInt(share),
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
        shareGroup: {
          select: {
            employee: true,
            document: true,
          },
        },
        departmentEmployeeRole: {
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
    return document;
  });

  return <ShareDocument document={records} />;
}
