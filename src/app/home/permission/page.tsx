"use server";
import { Permission } from "@/components/page/permissiondocument/page";
import { PrismaClient } from "@prisma/client";
import { DocumentStateEnum } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
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
                role: "ACCESSER",
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
      <Permission
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
