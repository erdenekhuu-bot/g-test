"use server";
import { prisma } from "@/action/prisma";

export async function AddTestCase(data: any) {
  try {
    await prisma.document.update({
      where: { id: Number(data.documentId) },
      data: {
        testcase: {
          createMany: {
            data: data.testcase,
            skipDuplicates: true,
          },
        },
      },
    });
    return 1;
  } catch (e) {
    console.error(e);
    return -1;
  }
}
