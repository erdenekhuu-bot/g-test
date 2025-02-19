import { PrismaClient } from "@prisma/client";
import axios, { AxiosResponse } from "axios";

interface JobPositionGroupRawType {
  id: string;
  name: string;
  note: string;
  status: string;
}

interface JobPositionRawType {
  id: number;
  departmentId: number;
  jobGroupId: number;
  name: string;
  description: string;
  isDeleted: boolean;
  timeCreated: Date;
  timeUpdate: Date
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
    const response = await axios.post(
      `${this.baseURL}/_sys/job/position/by/time/updated`,
      { "timeUpdated": "2024-11-12T00:00:00.000Z" },
      { timeout: 20000 }  // 10 секундийн хугацаа
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
        id: data.id,
      },
    });
    console.log(jobPosition);
    if (!jobPosition) {
      jobPosition = await prisma.jobPosition.create({
        data: {
          id: data.id,
          departmentId: data.departmentId,
          jobGroupId: data ? data.jobGroupId : null,
          name: data.name,
          description: data.description,
          isDeleted: data.isDeleted,
          timeCreated: data.timeCreated,
          timeUpdate: data.timeUpdate,
        },
      });
      console.log(`${jobPosition.id}. ${jobPosition.name} == created`);
    } else {
      jobPosition = await prisma.jobPosition.update({
        where: {
          id: jobPosition.id,
        },
        data: {
          departmentId: data.departmentId,
          jobGroupId: data ? data.jobGroupId : null,
          name: data.name,
          description: data.description,
          isDeleted: data.isDeleted,
          timeCreated: data.timeCreated,
          timeUpdate: data.timeUpdate
        },
      });
      console.log(`${jobPosition.id}, ${jobPosition.name} == updated`);
    }
  }
}

export default JobPositionSyncService;
