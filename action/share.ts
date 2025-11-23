"use server";

import { prisma } from "@/action/prisma";

export async function ShareGR(data: any) {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.authUser.findUnique({
        where: {
          id: data.authuser,
        },
        select: {
          employee: true,
        },
      });
      const userEntry = {
        employeeId: user?.employee?.id,
        documentId: data.documentId,
      };

      const merge = [
        ...data.sharegroup.map((item: any) => ({
          employeeId:
            typeof item.employeeId !== "number"
              ? item.employeeId.value
              : item.employeeId,
          documentId: item.documentId,
        })),
        userEntry,
      ];
      const unique = [
        ...new Map(merge.map((item: any) => [item.employeeId, item])).values(),
      ];

      const document = await tx.shareGroup.findFirst({
        where: {
          documentId: data.documentId,
        },
      });
      if (!document) {
        await tx.shareGroup.createMany({
          data: unique,
        });
      } else {
        await tx.shareGroup.deleteMany({
          where: {
            documentId: data.documentId,
          },
        });
        await tx.shareGroup.createMany({
          data: unique,
        });
      }
    });

    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}
