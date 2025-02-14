import { PrismaClient } from "@prisma/client";
import axios, { AxiosResponse } from "axios";

interface JobPositionGroupRawType {
  id: string;
  name: string;
  note: string;
  status: string;
}

interface JobPositionRawType {
  id: string;
  departmentId: string;
  level_group_id: string;
  name: string;
  status: string;
  fullname: string;
}

const prisma = new PrismaClient();

export class JobPositionSyncService {
  baseURL: string | undefined;

  constructor() {
    this.baseURL = "http://192.168.35.89:3080";
  }

  async sync() {
    await this.syncList();
  }

  async syncList() {
    const response: AxiosResponse = await axios.post(
      `${this.baseURL}/_sys/job/position/by/last/id`
    );
    const { status, data } = response;
    console.log(typeof data);

    if (status !== 200) {
      return;
    }

    for (const JobPositionInfo of data) {
      await this.syncJobPosition(JobPositionInfo);
    }
  }

  async syncJobPosition(data: JobPositionRawType) {
    let jobPosition = await prisma.jobPosition.findUnique({
      where: {
        id: parseInt(data.id),
      },
    });

    const department = await prisma.department.findUnique({
      where: {
        id: parseInt(data.departmentId),
      },
    });
    if (!department) {
      return;
    }

    const jobGroup = await prisma.jobPositionGroup.findUnique({
      where: {
        id: parseInt(data.level_group_id),
      },
    });
    console.log(jobPosition);
    if (!jobPosition) {
      jobPosition = await prisma.jobPosition.create({
        data: {
          id: parseInt(data.id),
          departmentId: department.id,
          jobGroupId: jobGroup ? jobGroup.id : null,
          name: data.name,
          description: data.fullname,
          isDeleted: false,
          timeCreated: new Date(),
        },
      });
      console.log(`${jobPosition.id}. ${jobPosition.name} == created`);
    } else {
      jobPosition = await prisma.jobPosition.update({
        where: {
          id: jobPosition.id,
        },
        data: {
          departmentId: parseInt(data.departmentId),
          jobGroupId: parseInt(data.level_group_id),
          name: data.name,
          description: data.fullname,
          isDeleted: false,
          timeCreated: new Date(),
        },
      });
      console.log(`${jobPosition.id}, ${jobPosition.name} == updated`);
    }
  }
}

export default JobPositionSyncService;
