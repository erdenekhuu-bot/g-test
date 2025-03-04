import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class Report {
    static makeReport = async (req:Request, res:Response) => {
       try {
        const {data} = req.body
        const report = await prisma.report.create({
            data: {
              reportname: data.reportname,
              reportpurpose: data.reportpurpose,
              reportprocessing: data.reportprocessing,
            },
          });

        const teamsData = data.name.map((n:any, index:number) => ({
            name: n,
            role: data.role[index],
            started: new Date(data.started[index]),
            ended: new Date(data.ended[index]),
            reportId: report.id, 
        }));

        const record =  await prisma.reportTeam.createMany({
            data: teamsData,
            skipDuplicates: true
          });
        res.json({
          success: true,
          data: record
        })
       } catch (error) {
      
        res.status(500).json({
            success: false,
            data: error
        })
       }
    }

    static makeSecondReport = async (req:Request, res:Response)=>{
        try {
            const {data} = req.body;
            await prisma.report.update({
                where: {
                    id: data.reportId
                },
                data: {
                    reportadvice: data.reportadvice,
                    reportconclusion: data.reportconclusion
                }
            })
            const issueData = data.list.map((n:any, index:number) => ({
                list: n,
                level: data.level[index],
                value: data.value[index],
                reportId: data.reportId, 
            }));
            const record =  await prisma.reportIssue.createMany({
                data: issueData,
                skipDuplicates: true
              });

            res.json({
                success: true,
                data: record
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                data: error
            })
        }
    }

    static readReport = async (req:Request, res:Response)=>{
        try {
           
           const record = await prisma.report.findMany();
            res.json({
                success: true,
                data: record
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error
            })
        }
    }

    static readDetail = async (req:Request, res:Response) => {
        try {
            const { detail } = req.params;
            const record = await prisma.report.findUnique({
                where: {
                    id: detail
                },
                include: {
                    team: true,
                    issue: true
                }
            }) 
            res.json({
                success: true,
                data: record
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error
            })
        }
    }
}