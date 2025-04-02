import { PrismaClient } from "@prisma/client";
import { DivisionReport } from "@/components/page/divisionreport/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page({ searchParams }: any) {
  const prisma = new PrismaClient();
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const session = await getServerSession(authOptions);
  const checkout = session?.user.permission.kind?.length;

  try {
    const records = await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: session?.user.id,
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });

      const document =
        checkout === 1
          ? await tx.employee.findUnique({
              where: {
                authUserId: session?.user.id,
              },
              include: {
                report: true,
                jobPosition: true,
              },
            })
          : await tx.employee.findMany({
              where: {
                AND: [
                  {
                    departmentId: authuser?.employee?.department.id,
                  },
                  {
                    isDeleted: false,
                  },
                ],
              },
              include: {
                report: true,
                jobPosition: true,
              },
            });

      return document;
    });
    const totalCount = Array.isArray(records) && records.length;
    const documentsArray = Array.isArray(records)
      ? records
      : records
      ? [records]
      : [];
    return (
      <DivisionReport
        documents={documentsArray}
        total={totalCount}
        pageSize={pageSize}
        page={page}
      />
    );
  } finally {
    await prisma.$disconnect();
  }
}
