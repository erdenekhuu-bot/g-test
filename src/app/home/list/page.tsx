import { PrismaClient } from "@prisma/client";
import ListDocument from "@/components/pages/listDocument";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ListLayout({
  searchParams,
}: {
  searchParams: { order?: string; page?: string; pageSize?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);

  try {
    const records = await prisma.departmentEmployeeRole.findMany({
      where: {
        AND: [
          {
            document: {
              authUserId: session.user.id,
            },
          },
          {
            role: "VIEWER",
          },
          {
            document: {
              generate: {
                contains: order,
              },
            },
          },
        ],
      },
      include: {
        document: {
          select: {
            title: true,
            generate: true,
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

    const totalCount = await prisma.departmentEmployeeRole.count({
      where: {
        document: {
          generate: {
            contains: order,
            mode: "insensitive",
          },
        },
      },
    });

    return (
      <ListDocument
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
