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
  console.log(session);

  try {
    const employee = await prisma.authUser.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        employee: true,
      },
    });
    const records =
      employee &&
      (await prisma.document.findMany({
        where: {
          generate: {
            contains: order,
            mode: "insensitive",
          },
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
      }));

    const totalCount = await prisma.document.count({
      where: {
        generate: {
          contains: order,
          mode: "insensitive",
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
