"use server";
import { Make } from "@/components/page/makedocument/page";
import { prisma } from "@/lib/prisma";
import { DocumentStateEnum } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const session = await getServerSession(authOptions);

  try {
    const records = await prisma.document.findMany({
      where: {
        AND: [
          {
            authUserId: session?.user.id,
          },

          {
            generate: {
              contains: order,
            },
          },
          {
            departmentEmployeeRole: {
              every: {
                state: DocumentStateEnum.ACCESS,
              },
            },
          },
        ],
      },

      skip: (page - 1) * pageSize,
      take: pageSize,
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
        file: true,
        report: true,
        departmentEmployeeRole: true,
      },

      orderBy: {
        timeCreated: "asc",
      },
    });

    const totalCount = records.length;

    return (
      <Make
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
