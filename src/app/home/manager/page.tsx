"use server";
import { prisma } from "@/lib/prisma";
import { MangerDocument } from "@/components/page/managerdocument/page";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";

  try {
    const records = await prisma.$transaction(async (tx) => {
      const list = await tx.document.findMany({
        where: {
          AND: [
            {
              generate: {
                contains: order || "",
              },
            },
            {
              state: "ACCESS",
            },
          ],
        },
        orderBy: {
          timeCreated: "desc",
        },
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
      });
      return list;
    });

    const totalCount = records.length;
    return (
      <MangerDocument
        documents={records}
        total={totalCount}
        pageSize={pageSize}
        page={page}
      />
    );
  } finally {
    await prisma.$disconnect();
  }
}
