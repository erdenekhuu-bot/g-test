import { PrismaClient } from "@prisma/client";
import { AuthUser, Permission } from "@prisma/client";

const prisma = new PrismaClient();

export async function CheckErp(arg: string, user: AuthUser) {
  const levels: any = {
    "Ерөнхий захирал": 6,
    "Дэд захирал": 5,
    "Газрын захирал": 4,
    "Газрын дэд захирал": 3,
    "Хэлтсийн дарга": 2,
    Менежер: 1,
    Инженер: 0,
  };

  if (!arg) return 0;
  return MakePermission(user, levels[arg]);
}

export async function MakePermission(user: any, permissionId: number) {
  try {
    const record = await prisma.authUserData.findUnique({
      where: {
        authUserId: user.id,
      },
    });
    const permissionLevels: any = {
      6: ["index_create", "index_read", "index_update", "index_delete"],
      5: ["index_create", "index_read", "index_update", "index_delete"],
      4: ["index_create", "index_read", "index_update", "index_delete"],
      3: ["index_create", "index_read"],
      2: ["index_create", "index_read"],
      1: ["index_read"],
      0: ["index_read"],
    };
    const permission = await prisma.permission.upsert({
      where: {
        id: record?.authUserId,
      },
      create: {
        id: user.id,
        kind: permissionLevels[permissionId],
      },
      update: {
        kind: permissionLevels[permissionId],
      },
    });

    return permission;
  } catch (error) {
    return -1;
  }
}
