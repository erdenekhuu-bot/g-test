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
  id: number;
  departmentId: number;
  jobPositionId: number;
  firstname: string;
  lastname: string
  familyName: string
  gender: string
  regNum: string
  birthDate: Date
  stateId: number
  authUserId: number
  isDeleted: boolean
  userCreatedId: number
  timeCreated: Date
  timeUpdated: Date
  note: string
  //

}

const prisma = new PrismaClient();

export class EmployeeSyncService {
  baseURL: string | undefined;

  constructor() {
    this.baseURL = "http://192.168.35.89:3080";
  }

  async sync() {
    await this.syncEmployees();
  }

  async syncEmployees() {
    const response = await axios.post(
      `${this.baseURL}/_sys/employee/by/time/updated`,
      { "timeUpdated": "2024-11-12T00:00:00.000Z" },
      { timeout: 20000 }
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
        id: data.id,
      },
    });

    console.log(employee);
    if (!employee) {
      try {
        employee = await prisma.employee.create({
          data: {
            id: data.id,
            departmentId: data.departmentId,
            jobPositionId: data.jobPositionId ?? null,
            firstname: data.firstname,
            lastname: data.lastname,
            familyName: data.familyName,
            regNum: data.regNum,
            gender: data.gender ?? null,
            birthDate: data.birthDate,
            stateId: data.stateId ?? null,
            authUserId: data.authUserId ?? null,
            isDeleted: data.isDeleted,
            note: data.note ?? null,
            userCreatedId: data.userCreatedId ?? null,
            timeCreated: data.timeCreated,
            timeUpdated: data.timeUpdated
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
            id: data.id,
            departmentId: data.departmentId,
            jobPositionId: data.jobPositionId ?? null,
            firstname: data.firstname,
            lastname: data.lastname,
            familyName: data.familyName,
            regNum: data.regNum,
            gender: data.gender ?? null,
            birthDate: data.birthDate,
            stateId: data.stateId ?? null,
            authUserId: data.authUserId ?? null,
            isDeleted: data.isDeleted,
            note: data.note ?? null,
            userCreatedId: data.userCreatedId ?? null,
            timeCreated: data.timeCreated,
            timeUpdated: data.timeUpdated
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
