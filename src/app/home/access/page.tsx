"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccessList } from "@/components/page/accessdocument/page";
import { DefineLevel } from "@/lib/checkout";
import { filterByPermissionLevels } from "@/lib/checkout";

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
          document: {
            generate: {
              contains: order || "",
            },
          },
        },
        distinct: ["employeeId"],
        orderBy: {
          document: {
            timeCreated: "desc",
          },
        },
        include: {
          employee: {
            include: {
              jobPosition: {
                select: {
                  jobPositionGroup: true,
                },
              },
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
      const dataWithLevels = list.map((item) => ({
        ...item,
        level: DefineLevel(
          item.employee?.jobPosition?.jobPositionGroup?.name || ""
        ),
      }));
      const filteredData = filterByPermissionLevels(dataWithLevels).filter(
        (item: any) => item.employeeId === data?.employee?.id
      );
      return filteredData;
    });
    const totalCount = records?.length;

    return (
      <AccessList
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
