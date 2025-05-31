"use server";
import { prisma } from "@/lib/prisma";
import { ListReport } from "@/components/page/allreportdocument/page";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;

  try {
    const records = await prisma.$transaction(async (tx) => {
      const document = await tx.report.findMany({
        include: {
          employee: {
            include: {
              jobPosition: true,
            },
          },
        },
      });

      return document;
    });
    const totalCount = records.length;
    return (
      <ListReport
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
