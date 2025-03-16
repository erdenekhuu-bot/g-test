import { PrismaClient } from "@prisma/client";
import PermissionDocument from "@/components/pages/permissionDocument";

export default async function PermissionLayout({
  searchParams,
}: {
  searchParams: { order?: string; page?: string; pageSize?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const prisma = new PrismaClient();

  try {
    const records = await prisma.document.findMany({
      where: {
        AND: [
          {
            state: "FORWARD",
          },
          {
            generate: {
              contains: order,
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
      <PermissionDocument
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
