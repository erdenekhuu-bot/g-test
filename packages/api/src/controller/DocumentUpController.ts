import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { TestcaseEnum } from "@prisma/client";
import { DocumentStateEnum } from "@prisma/client"
import { error } from "console";
import { waitForDebugger } from "inspector";
const prisma = new PrismaClient();

export const updateDetail = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;

          const { aim, intro } = req.body;
          const documentDetail = await prisma.documentDetail.findUnique({
               where: {
                    id: id,
               },
               include: {
                    document: {
                         select: {
                              state: true,
                         },
                    },
               },
          });
          const documentState = documentDetail?.document?.state;
          if (documentState === "DENY") {
               const update = await prisma.documentDetail.update({
                    where: {
                         id: id,
                    },
                    data: { intro, aim },
               });
               res.status(201).json({
                    success: true,
                    data: update,
               });
          } else {
               res.status(404).json({ success: false, message: "Cant edit" });
          }
     } catch (error) {
          res.status(500).json({ success: false, data: error });
     }
};

export const SentTest = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const parseid = parseInt(id)
          const { authUserId } = req.body
          const document = await prisma.document.findUnique({
               where: {
                    id: parseid,
               }
          });

          if (!document) {
               res.status(404).json({ success: false, error: "Document not found" })
               return
          }

          if (document?.authUserId !== authUserId) {
               res.status(403).json({ success: false, error: "authUserID error" })
               return
          }

          if (document?.state === DocumentStateEnum.DENY) {
               const updateDeny = await prisma.document.update({
                    where: {
                         id: document.id
                    },
                    data: {
                         state: DocumentStateEnum.FORWARD
                    }
               });
               res.status(201).json({ success: true, data: updateDeny })

          } else {
               res.status(403).json({ success: false, error: "Test already sent" })
          }
     } catch (error) {
          res.status(500).json({ success: false, error: error })
     }
}

export const approv = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const parseid = parseInt(id)
          const { state: newState, authUserId } = req.body;
          const authUser = await prisma.authUser.findUnique({
               where: { id: authUserId }
          })
          const document = await prisma.document.findUnique({
               where: { id: parseid }
          });
          if (document?.state === DocumentStateEnum.FORWARD || document?.state === DocumentStateEnum.REJECT) {
               if (newState === "REJECT") {
                    DocumentStateEnum.REJECT
               } else if (newState === "ACCESS") {
                    DocumentStateEnum.ACCESS;
               } else {
                    res.status(404).json({ success: false, error: "er" })
                    return;
               }

               const updateForward = await prisma.document.update({
                    where: {
                         id: document.id
                    },
                    data: {
                         state: newState
                    }
               })
               res.status(201).json({ success: true, data: updateForward })
          } else {
               res.status(403).json({ success: false, error: "error" })
          }
     } catch (error) {
          res.status(500).json({ success: false, error: error })
     }
}

export const updateTest = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const { employeeId, jobPositionId, departmentId, role } = req.body;
          const update = await prisma.test.update({
               where: {
                    id: id,
               },
               data: {
                    employeeId,
                    jobPositionId,
                    departmentId,
                    role,
                    timeUpdated: new Date(),
               },
          });
          res.status(201).json({
               success: true,
               data: update,
          });
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }
};

export const updateDocument = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const parsedId = Number(id);
          const { title, statement } = req.body;
          const update = await prisma.document.update({
               where: {
                    id: parsedId,
               },
               data: {
                    title,
                    statement,
                    timeUpdated: new Date()
               },
          });
          res.status(201).json({
               success: true,
               data: update,
          });
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }
}

export const listUpdate = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const parsedId = parseInt(id);
          const State = "DENY";
          const document = await prisma.document.findUnique({
               where: {
                    id: parsedId,
                    state: State,
               },
          });

          // const documentDetail = await prisma.test.findUnique({
          //      where: {
          //           id: parsedId,
          //      },
          //      include: {
          //           document: {
          //                select: {
          //                     state: true
          //                }
          //           }
          //      }
          // })
          // const documentState = documentDetail?.document?.state;

          if (document) {
               const { data } = req.body;
               const updateOps = data.map((model: any) => {
                    return prisma.$transaction([
                         prisma.documentAttribute.update({
                              where: { id: model.documentAttributeId },
                              data: {
                                   categoryMain: model.categoryMain,
                                   category: model.category,
                                   value: model.value,
                                   orderIndex: model.orderIndex,
                              },
                         }),
                         prisma.documentBudget.update({
                              where: {
                                   id: model.documentBudgetId,
                              },
                              data: {
                                   productCategory: model.productCategory,
                                   product: model.product,
                                   amount: model.amount,
                                   priceUnit: model.priceUnit,
                                   priceTotal: model.priceTotal,
                              },
                         }),
                         prisma.riskAssessment.update({
                              where: {
                                   id: model.riskId,
                              },
                              data: {
                                   riskDescription: model.riskDescription,
                                   riskLevel: model.riskLevel,
                                   affectionLevel: model.affectionLevel,
                                   mitigationStrategy: model.mitigationStrategy,
                              },
                         }),
                    ]);
               });
               const updateResult = await Promise.all(updateOps);
               res.status(201).json({ success: true, data: updateResult });
          } else {
               res
                    .status(401)
                    .json({ success: false, message: "document id not fount" });
               return;
          }
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }
};

export const testcaseupdate = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const { testType } = req.body;
          if (testType === TestcaseEnum.STARTED) {
               const update = await prisma.testCase.update({
                    where: {
                         id: id,
                    },
                    data: {
                         startDate: new Date(),
                         testType: testType.toUpperCase(),
                    },
               });
               res.status(201).json({
                    success: true,
                    data: update,
               });
          } else if (testType === TestcaseEnum.ENDED) {
               const update = await prisma.testCase.update({
                    where: {
                         id: id,
                    },
                    data: {
                         endDate: new Date(),
                         testType: testType.toUpperCase(),
                    },
               });
               res.status(201).json({
                    success: true,
                    data: update,
               });
          } else {
               res.status(400).json({ success: false, message: "error" });
          }
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }
};

export const documentUpdate = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const parsedId = Number(id);
          const { title, statement } = req.body;
          const DENY = "DENY";
          if (DENY) {
               const update = await prisma.document.update({
                    where: {
                         id: parsedId,
                         state: DENY,
                    },
                    data: {
                         title,
                         statement,
                    },
               });
               res.status(201).json({
                    success: true,
                    data: update,
               });
          } else {
               res.status(404).json({
                    success: false,
                    message: "cant edit",
               });
          }
     } catch (error) {
          res.status(500).json({ success: false, data: error });
     }
};

export const updateAttribute = async (req: Request, res: Response) => {

};

