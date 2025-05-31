"use server";
import { Report } from "@/components/page/reportdocument/page";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const session = await getServerSession(authOptions);
  try {
    const authuser = await prisma.authUser.findUnique({
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
    const records = await prisma.$transaction(async (tx) => {
      const document = await tx.employee.findMany({
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
          authUser: {
            include: {
              Document: {
                where: {
                  AND: [
                    {
                      generate: {
                        contains: order || "",
                      },
                    },
                  ],
                },
                include: {
                  file: true,
                  user: {
                    select: {
                      employee: {
                        select: {
                          firstname: true,
                          lastname: true,
                        },
                      },
                    },
                  },
                  departmentEmployeeRole: true,
                },
                orderBy: {
                  timeCreated: "asc",
                },
              },
            },
          },
          jobPosition: true,
        },
      });
      return document;
    });
    const totalCount = await prisma.employee.count({
      where: {
        departmentId: authuser?.employee?.department.id,
      },
    });

    return (
      <Report
        documents={records}
        total={totalCount}
        page={page}
        pageSize={pageSize}
        order={order}
      />
    );
  } finally {
    await prisma.$disconnect();
  }
}
