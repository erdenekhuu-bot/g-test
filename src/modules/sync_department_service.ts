import { PrismaClient } from "@prisma/client";
import axios from "axios";

type DepartmentRawType = {
  id: number;
  parentId: number;
  name: string;
  description: string;
  authDivision: boolean;
  isDeleted: boolean;
  parentsNesting: string;
  timeCreated: Date;
  timeUpdated: Date;
};

type DerDataType = {
  departmentId: number;
  employeeId: number;
};

const prisma = new PrismaClient();

class DepartmentSyncService {
  baseURL: string | undefined;
  derDataList: DerDataType[] = [];

  constructor() {
    this.baseURL = "http://192.168.35.89:3080";
  }

  async sync() {
    const response = await axios.post(
      `${this.baseURL}/_sys/department/by/time/updated`,
      { timeUpdated: "2024-11-12T00:00:00.000Z" },
      { timeout: 20000 }
    );
    const { status, data } = response;

    if (status !== 200) {
      return;
    }

    this.derDataList = [];

    for (const departmentInfo of data) {
      await this.syncDepartment(departmentInfo);
    }
  }

  async syncDepartment(data: DepartmentRawType) {
    let department = await prisma.department.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!department) {
      department = await prisma.department.create({
        data: {
          id: data.id,
          parentId: data.parentId,
          name: data.name,
          description: data ? data.description : null,
          authDivision: data.authDivision,
          isDeleted: data.isDeleted,
          parentsNesting: data ? data.parentsNesting : null,
          timeCreated: data.timeCreated,
          timeUpdated: data.timeUpdated,
        },
      });
      console.log(`${department.id}. ${department.name} == created`);
    } else {
      const isChanged =
        department.id !== data.id ||
        department.parentId !== data.parentId ||
        department.name !== data.name ||
        department.description !== data.description ||
        department.authDivision !== data.authDivision ||
        department.isDeleted !== data.isDeleted ||
        department.parentsNesting !== data.parentsNesting;

      if (isChanged) {
        department = await prisma.department.update({
          where: {
            id: department.id,
          },
          data: {
            parentId: data.parentId,
            name: data.name,
            description: data ? data.description : null,
            authDivision: data.authDivision,
            isDeleted: data.isDeleted,
            parentsNesting: data ? data.parentsNesting : null,
            timeCreated: data.timeCreated,
            timeUpdated: data.timeUpdated,
          },
        });
        console.log(`${department.id}. ${department.name} == updated`);
      }
    }
  }
}
export default DepartmentSyncService;
