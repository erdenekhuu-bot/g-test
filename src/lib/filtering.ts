import { prisma } from "@/lib/prisma";

export const filterEmployee = async (id: any): Promise<number | undefined> => {
  if (typeof id !== "string" || id.split(" ").length < 2) {
    return undefined;
  }

  try {
    const result = await prisma.employee.findFirst({
      where: {
        AND: [{ firstname: id.split(" ")[0] }, { lastname: id.split(" ")[1] }],
      },
      select: {
        id: true,
      },
    });

    if (!result) {
      return undefined;
    }

    return result.id;
  } catch (error) {
    return undefined;
  }
};

export const filterEmployeeStat = async (name: any): Promise<any> => {
  try {
    const { value } = name;
    return value;
  } catch (error) {
    return undefined;
  }
};
