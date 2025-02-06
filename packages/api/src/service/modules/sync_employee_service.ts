import { PrismaClient } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { storePermissions } from "./auth_service";
interface EmployeeStatetRawType {
  id: string;
  name: string;
  type: string;
  need_alternate: string;
  note: string;
  status: string;
}

interface EmployeeRawType {
  id: string;
  departmentId: string;
  jobPositionId: string;
  authUserId: string;
  familyName: string;
  lastname: string;
  firstname: string;
  gender: string | null;
  birthDate: string;
  regNum: string;
  image_url: string | null;
  status: string | null;
  current_state_id: string;
}

const prisma = new PrismaClient();

export class EmployeeSyncService {
  baseURL: string | undefined;

  constructor() {
    // this.baseURL = process.env.ERP_HRM_BASE_URL;
    this.baseURL = "http://192.168.35.89:3080";
  }

  async sync() {
    await this.syncEmployees();
  }

  async syncEmployees() {
    const response: AxiosResponse = await axios.post(
      `${this.baseURL}/_sys/employee/by/last/id`
    );
    const { status, data } = response;
    if (status !== 200) {
      return;
    }

    for (const employeeInfo of data) {
      await this.syncEmployee(employeeInfo);
    }
  }

  async syncEmployee(data: EmployeeRawType) {
    let employee = await prisma.employee.findUnique({
      where: {
        id: parseInt(data.id),
      },
    });

    const authUser = await prisma.user.findUnique({
      where: {
        id: parseInt(data.authUserId ?? "0"),
      },
    });

    const department = await prisma.department.findUnique({
      where: {
        id: parseInt(data.departmentId ?? 0),
      },
    });

    if (!department) {
      return;
    }

    const jobPosition = await prisma.jobPosition.findUnique({
      where: {
        id: parseInt(data.jobPositionId ?? 0),
      },
    });
    console.log(employee);
    if (!employee) {
      try {
        employee = await prisma.employee.create({
          data: {
            id: parseInt(data.id),
            departmentId: department.id,
            jobPositionId: jobPosition ? jobPosition.id : null,
            firstname: data.firstname,
            lastname: data.lastname,
            familyName: data.familyName,
            regNum: data.regNum,
            birthDate: new Date(data.birthDate),
            stateId: null,
            authUserId: authUser ? authUser.id : null,
            isDeleted: data.status != "A",
          },
        });
        console.log(`${data.id}. ${data.firstname} == created`);
      } catch (error) {
        console.error(error);
      }
      // console.log(`${employee.id}. ${employee.firstname} == created`);
    } else {
      try {
        employee = await prisma.employee.update({
          where: {
            id: employee.id,
          },
          data: {
            departmentId: department.id,
            jobPositionId: jobPosition ? jobPosition.id : null,
            firstname: data.firstname,
            lastname: data.lastname,
            familyName: data.familyName,
            regNum: data.regNum,
            birthDate: new Date(data.birthDate),
            stateId: null,
            authUserId: authUser ? authUser.id : null,
            isDeleted: data.status != "A",
          },
        });
        console.log(`${employee.id}. ${employee.firstname} == updated`);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export default EmployeeSyncService;
