import { PrismaClient } from "@prisma/client";
import { PhonePage } from "./phonepage";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const search = searchParams.search || "";
  const prisma = new PrismaClient();

  try {
    const records = await prisma.document.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        report: {
          select: {
            usedphone: {
              where: {
                phone: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      },

      orderBy: {
        timeCreated: "asc",
      },
    });

    const totalCount = records.length;

    return (
      <PhonePage
        documents={records}
        total={totalCount}
        page={page}
        pageSize={pageSize}
        order={search}
      />
    );
  } finally {
    await prisma.$disconnect();
  }
}
