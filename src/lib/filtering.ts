import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const filterEmployee = async (employee: any) => {
  if (typeof employee === "number") {
    const result = await prisma.employee.findFirst({
      where: {
        id: employee,
        isDeleted: false,
      },
      select: {
        id: true,
      },
    });
    return result?.id;
  }

  const [firstname, lastname] = employee.split(" ");

  const result = await prisma.employee.findFirst({
    where: {
      AND: [
        {
          firstname: firstname,
        },
        {
          lastname: lastname,
        },
        {
          isDeleted: false,
        },
      ],
    },
    select: {
      id: true,
    },
  });
  return result?.id;
};
