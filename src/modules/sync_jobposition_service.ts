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
  timeUpdated: Date;
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
      { timeUpdated: "2024-11-12T00:00:00.000Z" },
      { timeout: 20000 } // 10 секундийн хугацаа
    );
    const { status, data } = response;

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
          timeUpdated: data.timeUpdated,
        },
      });
      console.log(`${jobPosition.id}. ${jobPosition.name} == created`);
    } else {
      const jobPositionDate = new Date(jobPosition.timeCreated)
        .toISOString()
        .split("T")[0];
      const dataDate = new Date(data.timeCreated).toISOString().split("T")[0];
      const jobPositionDateUp = new Date(jobPosition.timeUpdated)
        .toISOString()
        .split("T")[0];
      const dataDateUp = new Date(data.timeUpdated).toISOString().split("T")[0];
      const isChanged =
        jobPosition.id !== data.id ||
        jobPosition.departmentId !== data.departmentId ||
        jobPosition.jobGroupId !== data.jobGroupId ||
        jobPosition.name !== data.name ||
        jobPosition.description !== data.description ||
        jobPosition.isDeleted !== data.isDeleted ||
        jobPositionDate !== dataDate ||
        jobPositionDateUp !== dataDateUp;

      if (isChanged) {
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
            timeUpdated: data.timeUpdated,
          },
        });
        console.log(`${jobPosition.id}, ${jobPosition.name} == updated`);
      }
    }
  }
}

export default JobPositionSyncService;
