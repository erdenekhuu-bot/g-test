"use server";
import { Report } from "@/components/page/reportdocument/page";
import { PrismaClient } from "@prisma/client";
import { DocumentStateEnum } from "@prisma/client";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const prisma = new PrismaClient();

  try {
    const records = await prisma.document.findMany({
      where: {
        AND: [
          {
            state: DocumentStateEnum.ACCESS,
          },
          {
            generate: {
              contains: order,
            },
          },
          {
            statement: {
              not: null,
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
      },

      orderBy: {
        timeCreated: "asc",
      },
    });

    const totalCount = records.length;

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
