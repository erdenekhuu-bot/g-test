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
  name: string;
  jobAuthRank: number;
  description: string;
  timeCreated: Date;
  timeUpdated: Date;
  isDeleted: boolean;
}

const prisma = new PrismaClient();

export class JobPositionGroupSyncService {
  baseURL: string | undefined;

  constructor() {
    this.baseURL = "http://192.168.35.89:3080";
  }

  async sync() {
    await this.syncList();
  }

  async syncList() {
    const response = await axios.get(
      `${this.baseURL}/_sys/job/position/group`,
      { timeout: 20000 } // 10 секундийн хугацаа
    );
    const { status, data } = response;
    if (status !== 200) {
      return;
    }

    for (const JobPositionInfo of data) {
      await this.syncJobPositionGroup(JobPositionInfo);
    }
  }

  async syncJobPositionGroup(data: JobPositionRawType) {
    let jobPositionGroup = await prisma.jobPositionGroup.findUnique({
      where: {
        id: parseInt(data.id),
      },
    });
    if (!jobPositionGroup) {
      jobPositionGroup = await prisma.jobPositionGroup.create({
        data: {
          id: parseInt(data.id),
          name: data.name,
          jobAuthRank: data ? data.jobAuthRank : null,
          description: data.description,
          isDeleted: false,
          timeCreated: new Date(),
        },
      });
    } else {
      const isChanged =
        jobPositionGroup.id !== parseInt(data.id) ||
        jobPositionGroup.name !== data.name ||
        jobPositionGroup.jobAuthRank !== data.jobAuthRank ||
        jobPositionGroup.description !== data.description ||
        jobPositionGroup.isDeleted !== data.isDeleted;
      if (isChanged) {
        jobPositionGroup = await prisma.jobPositionGroup.update({
          where: {
            id: jobPositionGroup.id,
          },
          data: {
            name: data.name,
            jobAuthRank: data ? data.jobAuthRank : null,
            description: data.description,
            isDeleted: data.isDeleted,
          },
        });
        console.log(`${jobPositionGroup.name} == updated`);
      } else {
      }
    }
  }
}

export default JobPositionGroupSyncService;
