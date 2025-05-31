"use server";
import { Create } from "@/components/page/createdocument/page";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page as string, 10) || 1;
  const pageSize = parseInt(searchParams.pageSize as string, 10) || 10;
  const session = await getServerSession(authOptions);
  const order = searchParams.order;

  try {
    const records = await prisma.document.findMany({
      where: {
        AND: [
          { authUserId: session?.user.id },
          {
            generate: {
              contains: order || "",
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

    const totalCount = await prisma.document.count({
      where: {
        authUserId: session?.user.id,
      },
    });

    return (
      <Create
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
