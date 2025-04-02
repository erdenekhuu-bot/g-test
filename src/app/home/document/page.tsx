"use server";
import { Make } from "@/components/page/makedocument/page";
import { PrismaClient } from "@prisma/client";
import { DocumentStateEnum } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);

  try {
    const records = await prisma.document.findMany({
      where: {
        AND: [
          {
            authUserId: session?.user.id,
          },
          {
            state: DocumentStateEnum.ACCESS,
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
        report: true,
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
