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
     timeUpdated: Date

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
               { timeout: 20000 }  // 10 секундийн хугацаа
          );
          const { status, data } = response;
          console.log(typeof data);

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
          console.log(jobPositionGroup);
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
          }
     }
}

export default JobPositionGroupSyncService;
