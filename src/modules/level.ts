import { PrismaClient } from "@prisma/client";
import { AuthUser, Permission } from "@prisma/client";

const prisma = new PrismaClient();

export async function CheckErp(data: any) {
  const record = await prisma.authUserData.findUnique({
    where: {
      authUserId: data.id,
    },
  });
  if (!record) {
    return null;
  }
  const checkout =
    data.employee.jobPosition.name.includes("дарга") ||
    data.employee.jobPosition.name.includes("захирал");
  const permission = await prisma.permission.upsert({
    where: {
      id: record?.authUserId,
    },
    create: {
      id: data.id,
      kind: checkout
        ? ["index_create", "index_read", "index_update", "index_delete"]
        : [],
    },
    update: {
      kind: checkout
        ? ["index_create", "index_read", "index_update", "index_delete"]
        : [],
    },
  });

  return permission;
}
