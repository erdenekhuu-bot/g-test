"use server";
import { List } from "@/components/page/listdocument/page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

export default async function Page({ searchParams }: any) {
  const session = await getServerSession(authOptions);
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const prisma = new PrismaClient();

  try {
    const records = await prisma.$transaction(async (tx) => {
      const data = await prisma.authUser.findUnique({
        where: {
          id: session?.user.id,
        },
        include: {
          employee: true,
        },
      });
      const list =
        data &&
        (await prisma.departmentEmployeeRole.findMany({
          where: {
            AND: [
              {
                employeeId: data.employee?.id,
              },
              {
                document: {
                  generate: {
                    contains: order || "",
                  },
                },
              },
            ],
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
                departmentEmployeeRole: true,
              },
            },
          },
        }));
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
