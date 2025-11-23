import { prisma } from "@/action/prisma";

export async function ChangeStatus(data: any) {
  try {
    await prisma.employee.update({
      where: {
        id: Number(data.employeeId),
      },
      data: {
        super: data.super,
      },
    });
    return 1;
  } catch (error) {
    return -1;
  }
}
export const convertAdmin = (data: any[]) => {
  const converting = data.map((index: any, key: number) => {
    return {
      id: key,
      value: index.id,
      label: index.name,
    };
  });
  return converting;
};
