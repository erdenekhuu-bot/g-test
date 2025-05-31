"use server";
import { List } from "@/components/page/listdocument/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Page({ searchParams }: any) {
  const session = await getServerSession(authOptions);
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";

  try {
    const records = await prisma.$transaction(async (tx) => {
      const data = await tx.authUser.findUnique({
        where: {
          id: session?.user.id,
        },
        include: {
          employee: true,
        },
      });
      const list = await tx.departmentEmployeeRole.findMany({
        where: {
          AND: [
            {
              employeeId: data?.employee?.id,
            },
            {
              document: {
                AND: [
                  {
                    generate: {
                      contains: order || "",
                    },
                  },
                  {
                    state: "FORWARD",
                  },
                ],
              },
            },
          ],
        },
        distinct: ["documentId"],
        orderBy: {
          document: {
            timeCreated: "desc",
          },
        },
        include: {
          employee: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          document: {
            include: {
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
            },
          },
        },
      });

      return list;
    });
    const totalCount = records?.length;

    return (
      <List
        documents={records}
        total={totalCount}
        pageSize={pageSize}
        page={page}
        order={order}
      />
    );
  } finally {
    await prisma.$disconnect();
  }
}
