"use server";

import { prisma } from "@/action/prisma";

function stripId(arr: any[]): any[] {
  return arr.map(({ id, ...rest }) => rest);
}

export async function createDocument(data: any) {
  try {
    const customrelation = data.testteam
      .map((item: any) => {
        if (item.role === "Хяналт тавих, Асуудал шийдвэрлэх") {
          return {
            employeeId: item.employeeId,
            role: "MIDDLE",
          };
        }
        return null;
      })
      .filter((item: any) => item !== null);

    const attaching = [
      ...data.converting.departmentemployee,
      ...customrelation,
    ];
    const strippedData = attaching.map(({ id, ...rest }: any) => rest);
    const bankData = {
      name: data.bank.bankname,
      address: data.bank.bank,
    };
    await prisma.$transaction(async (tx) => {
      const authuser = await tx.authUser.findUnique({
        where: {
          id: Number(data.converting.authuserId),
        },
        include: {
          employee: {
            include: {
              department: true,
            },
          },
        },
      });
      await tx.document.create({
        data: {
          authUserId: authuser?.id,
          userDataId: authuser?.id,
          generate: data.converting.generate,
          state: "DENY",
          title: data.converting.title,
          detail: {
            create: {
              intro: data.converting.intro,
              aim: data.converting.aim,
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: strippedData,
            },
          },
          documentemployee: {
            createMany: {
              data: stripId(data.testteam),
            },
          },
          attribute: { createMany: { data: stripId(data.attributeData) } },
          budget: { createMany: { data: stripId(data.budgetdata) } },
          riskassessment: { createMany: { data: stripId(data.riskdata) } },
          bank: bankData,
          testcase: {
            createMany: {
              data: data.testcase,
              skipDuplicates: true,
            },
          },
        },
      });
    });
    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}
export async function FullUpdate(data: any) {
  try {
    const checkout = await prisma.departmentEmployeeRole.findMany({
      where: { documentId: Number(data.documentId) },
    });

    const result = data.departmentemployee.map((item: any) => {
      return {
        employeeId:
          typeof item.employeeId !== "number"
            ? item.employeeId.value
            : item.employeeId,
        role: item.role,
      };
    });

    const team = data.testteam.map((item: any) => {
      return {
        employeeId:
          typeof item.employeeId !== "number"
            ? item.employeeId.value
            : item.employeeId,
        role: item.role,
        startedDate: item.startedDate,
        endDate: item.endDate,
      };
    });
    const customrelation = data.testteam
      .map((item: any) => {
        if (item.role === "Хяналт тавих, Асуудал шийдвэрлэх") {
          return {
            employeeId:
              typeof item.employeeId !== "number"
                ? item.employeeId.value
                : item.employeeId,

            role: "MIDDLE",
          };
        }
        return null;
      })
      .filter((item: any) => item !== null);

    const finalMerged = [...result, ...customrelation];
    const mergedWithState = finalMerged.map((item) => {
      const old = checkout.find(
        (c) => c.employeeId === item.employeeId && c.role === item.role
      );

      return {
        ...item,
        state: old ? old.state : "DENY",
      };
    });

    await prisma.$transaction(async (tx) => {
      await tx.documentAttribute.deleteMany({
        where: { documentId: Number(data.documentId) },
      });
      await tx.riskAssessment.deleteMany({
        where: { documentId: Number(data.documentId) },
      });
      await tx.documentBudget.deleteMany({
        where: { documentId: Number(data.documentId) },
      });
      await tx.testCase.deleteMany({
        where: { documentId: Number(data.documentId) },
      });
      await tx.departmentEmployeeRole.deleteMany({
        where: { documentId: Number(data.documentId) },
      });
      await tx.documentEmployee.deleteMany({
        where: { documentId: Number(data.documentId) },
      });

      await tx.document.update({
        where: { id: Number(data.documentId) },
        data: {
          title: data.title,
          generate: data.generate,
          bank: {
            name: data.bank.bankname,
            address: data.bank.bank,
          },
          detail: {
            update: {
              where: { documentId: Number(data.documentId) },
              data: {
                intro: data.intro,
                aim: data.aim,
              },
            },
          },
          departmentEmployeeRole: {
            createMany: {
              data: mergedWithState,
            },
          },
          documentemployee: {
            createMany: {
              data: team,
            },
          },
          attribute: {
            createMany: {
              data: data.attributeData,
            },
          },
          riskassessment: {
            createMany: {
              data: data.riskdata,
            },
          },
          budget: {
            createMany: {
              data: data.budgetdata,
            },
          },
          testcase: {
            createMany: {
              data: data.testcase,
              skipDuplicates: true,
            },
          },
        },
      });
    });
    return 1;
  } catch (error) {
    console.error(error);
    return -1;
  }
}
