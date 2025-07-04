"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConfirmDocument } from "@/components/page/confrimdocument/page";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page as string, 10) || 1;
  const pageSize = parseInt(searchParams.pageSize as string, 10) || 10;
  const session = await getServerSession(authOptions);
  const order = searchParams.order;
  try {
    const records = await prisma.$transaction(async (tx) => {
      const authUser = await tx.authUser.findUnique({
        where: {
          id: session?.user.id,
        },
        select: {
          employee: true,
        },
      });
      const result = await tx.confirmPaper.findMany({
        where: {
          employeeId: authUser?.employee?.id,
        },
        include: {
          document: {
            include: {
              user: {
                select: {
                  employee: true,
                },
              },
            },
          },
        },
      });

      return result;
    });

    const totalCount = records.length;
    return (
      <ConfirmDocument
        documents={records}
        total={totalCount}
        page={page}
        pageSize={pageSize}
        order={order}
      />
    );
  } finally {
  }
}
