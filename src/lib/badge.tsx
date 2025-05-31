import { prisma } from "@/lib/prisma";

export async function notification(id: number) {
  try {
    const record = await prisma.authUser.findUnique({
      where: {
        id,
      },
    });
    return 1;
  } catch (error) {
    return -1;
  }
}
