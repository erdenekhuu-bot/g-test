import { PrismaClient } from "@prisma/client";
import axios, { AxiosResponse } from "axios";

type DepartmentRawType = {
  id: number;
  parentId: number;
  name: string;
  description: string;
  authDivision: boolean;
  isDeleted: boolean;
  parentsNesting: string;
  timeCreated: Date;
  timeUpdated: Date
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
      { "timeUpdated": "2024-11-12T00:00:00.000Z" },
      { timeout: 20000 }
    );
    const { status, data } = response;
    console.log(typeof data);

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
          timeUpdate: data.timeUpdated

        },
      });
      console.log(`${department.id}. ${department.name} == created`);
    } else {
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
          timeUpdate: data.timeUpdated
        },
      });
      console.log(`${department.id}. ${department.name} == updated`);
    }

    // if (data.leader_id && parseInt(data.leader_id) > 0) {
    //   this.derDataList.push({
    //     departmentId: department.id,
    //     employeeId: parseInt(data.leader_id),
    //   });
    // }
    // if (data.sign_leader_id && parseInt(data.sign_leader_id) > 0) {
    //   this.derDataList.push({
    //     departmentId: department.id,
    //     employeeId: parseInt(data.sign_leader_id),
    //   });
    // }
  }

  // async syncDepartmentAdminRole() {
  //   const role = "authority";
  //   let der;
  //   for (const derData of this.derDataList) {
  //     der = await prisma.departmentEmployeeRole.findFirst({
  //       where: { ...derData, role },
  //     });
  //     if (der) {
  //       if (der.isDeleted == true) {
  //         der = await prisma.departmentEmployeeRole.update({
  //           where: { id: der.id },
  //           data: { isDeleted: false },
  //         });
  //       }
  //     } else {
  //       der = await prisma.departmentEmployeeRole.create({
  //         data: { ...derData, role },
  //       });
  //     }
  //   }
  // }
}

export default DepartmentSyncService;
