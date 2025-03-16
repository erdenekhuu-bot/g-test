import { PrismaClient } from "@prisma/client";
import CreateDocument from "@/components/pages/createDocument";

export default async function CreateLayout({
  searchParams,
}: {
  searchParams: { order?: string; page?: string; pageSize?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;

  const prisma = new PrismaClient();

  try {
    const records = await prisma.document.findMany({
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

    const totalCount = await prisma.document.count({});

    return (
      <CreateDocument
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
