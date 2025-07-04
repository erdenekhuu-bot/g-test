"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SharedList } from "@/components/page/sharedocument/list";

export default async function Page({ searchParams }: any) {
  const page = parseInt(searchParams.page || "1", 10) || 1;
  const pageSize = parseInt(searchParams.pageSize || "10", 10) || 10;
  const order = searchParams.order || "";
  const session = await getServerSession(authOptions);
  try {
    const record = await prisma.$transaction(async (tx) => {
      const authUser = await tx.authUser.findUnique({
        where: {
          id: session?.user.id,
        },
        include: {
          employee: true,
        },
      });
      const document =
        authUser &&
        (await tx.shareGroup.findMany({
          where: {
            AND: [
              {
                employeeId: authUser.employee?.id,
              },
              {
                document: {
                  state: "SHARED",
                },
              },
            ],
          },
          include: {
            employee: true,
            document: true,
          },
        }));
      return document;
    });

    return <SharedList documents={record} />;
  } finally {
    await prisma.$disconnect();
  }
}
