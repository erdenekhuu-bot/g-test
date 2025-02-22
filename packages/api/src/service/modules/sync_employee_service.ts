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
    const auth = data.authUserId
    const existingAuthUser = data.authUserId
      ? await prisma.authUser.findUnique({
        where: { id: data.authUserId },
      })
      : null;
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
            authUserId: existingAuthUser ? data.authUserId : null,
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
    } else {
      try {
        const birthday = new Date(employee.birthDate).toISOString().split("T")[0];
        const databirthday = new Date(data.birthDate).toISOString().split("T")[0];
        const created = new Date(employee.timeCreated).toISOString().split("T")[0];
        const dataCreated = new Date(data.timeCreated).toISOString().split("T")[0];
        const updated = new Date(employee.timeUpdated).toISOString().split("T")[0];
        const dataUpdated = new Date(data.timeUpdated).toISOString().split("T")[0];

        // const changedFields: string[] = [];

        // if (employee.id !== data.id) changedFields.push("id");
        // if (employee.firstname !== data.firstname) changedFields.push("firstname");
        // if (employee.departmentId !== data.departmentId) changedFields.push("departmentId");
        // if ((employee.jobPositionId ?? null) !== (data.jobPositionId ?? null)) changedFields.push("jobPositionId");
        // if (employee.lastname !== data.lastname) changedFields.push("lastname");
        // if (employee.familyName !== data.familyName) changedFields.push("familyName");
        // if (employee.regNum !== data.regNum) changedFields.push("regNum");
        // if (birthday !== databirthday) changedFields.push("birthDate");
        // if ((employee.stateId ?? null) !== (data.stateId ?? null)) changedFields.push("stateId");
        // if (employee.authUserId !== data.authUserId && !(employee.authUserId == null && data.authUserId == null)) {
        //   changedFields.push("authUserId");
        // }
        // if (employee.isDeleted !== data.isDeleted) changedFields.push("isDeleted");
        // if ((employee.userCreatedId ?? null) !== (data.userCreatedId ?? null)) changedFields.push("userCreatedId");
        // if (created !== dataCreated) changedFields.push("timeCreated");
        // if (updated !== dataUpdated) changedFields.push("timeUpdated");
        // if (employee.note !== data.note) changedFields.push("note");

        // const isChanged = changedFields.length > 0;

        // if (isChanged) {
        //   console.log(`📌 Өөрчлөгдсөн талбарууд: ${changedFields.join(", ")}`);
        //   console.log(`DB authUserId:`, data);

        // }

        const isChanged =
          employee.id !== data.id ||
          employee.firstname !== data.firstname ||
          employee.departmentId !== data.departmentId ||
          (employee.jobPositionId ?? null) !== (data.jobPositionId ?? null) ||
          employee.lastname !== data.lastname ||
          employee.familyName !== data.familyName ||
          employee.regNum !== data.regNum ||
          birthday !== databirthday ||
          (employee.stateId ?? null) !== (data.stateId ?? null) ||
          (employee.authUserId ?? null) !== (data.authUserId ?? null) ||
          employee.isDeleted !== data.isDeleted ||
          (employee.userCreatedId ?? null) !== (data.userCreatedId ?? null) ||
          created !== dataCreated ||
          updated !== dataUpdated ||
          employee.note !== data.note;

        if (isChanged) {
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
              authUserId: existingAuthUser ? data.authUserId : null,
              isDeleted: data.isDeleted,
              note: data.note ?? null,
              userCreatedId: data.userCreatedId ?? null,
              timeCreated: data.timeCreated,
              timeUpdated: data.timeUpdated
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

export default EmployeeSyncService;
