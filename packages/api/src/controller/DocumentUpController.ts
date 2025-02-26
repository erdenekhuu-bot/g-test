import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { TestcaseEnum } from "@prisma/client";
import { DocumentStateEnum } from "@prisma/client";
import { Risk } from "@prisma/client";
const prisma = new PrismaClient();

export const updateDocument = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const parsedId = Number(id);
          const { title, statement } = req.body;

          const check = await prisma.document.findUnique({
               where: {
                    id: parsedId,
               }
          })

          if (check?.state !== DocumentStateEnum.DENY) {
               res.status(404).json({ success: false, error: "Document already sent" });
               return
          }

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
          if (documentState === DocumentStateEnum.DENY) {
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


export const updateDepartmentEmployee = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const { employeeId, role } = req.body;
          const employee = await prisma.employee.findUnique({
               where: {
                    id: employeeId,
               }
          })

          if (!employee) {
               res.status(404).json({ success: false, error: "employee not found" });
               return
          }

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

          if (documentDetail?.document?.state !== DocumentStateEnum.DENY) {
               res.status(403).json({ success: false, error: "Already sent document" })
               return
          }

          const update = await prisma.departmentEmployeeRole.update({
               where: {
                    id: id,
               },
               data: {
                    employeeId,
                    jobPositionId: employee?.jobPositionId,
                    departmentId: employee?.departmentId,
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


export const updateTestTeam = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const { employeeId, role, startedDate, endDate } = req.body;

          const employee = await prisma.employee.findUnique({
               where: {
                    id: employeeId,
               }
          })

          if (!employee) {
               res.status(404).json({ success: false, error: "employee not found" });
               return
          }

          const find = await prisma.documentEmployee.findFirst({
               include: {
                    document: true
               }
          })

          if (find?.document.state !== DocumentStateEnum.DENY) {
               res.status(403).json({ success: false, error: "Already sent document" })
               return
          }

          const update = await prisma.documentEmployee.update({
               where: {
                    id: id
               },
               data: {
                    employeeId: employee.id,
                    jobPositionId: employee?.jobPositionId,
                    departmentId: employee?.departmentId,
                    role,
                    startedDate,
                    endDate,
                    updateTimed: new Date()
               }
          })
          res.status(201).json({ success: false, data: update })
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }

}


export const updateAttribute = async (req: Request, res: Response) => {
     try {
          const { id } = req.params
          const { categoryMain, category, value } = req.body

          const find = await prisma.documentAttribute.findFirst({
               include: {
                    document: true
               }
          })

          if (find?.document.state !== DocumentStateEnum.DENY) {
               res.status(403).json({ success: false, error: "Already sent document" })
               return
          }

          const update = await prisma.documentAttribute.update({
               where: {
                    id: id
               },
               data: {
                    categoryMain,
                    category,
                    value,
                    updateTimed: new Date()
               }
          })
          res.status(201).json({ success: false, data: update })
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }
};


export const updateBudget = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const { productCategory, product, amount, priceUnit, priceTotal } = req.body

          const find = await prisma.documentBudget.findFirst({
               include: {
                    document: true
               }
          })

          if (find?.document.state !== DocumentStateEnum.DENY) {
               res.status(403).json({ success: false, error: "Already sent document" })
               return
          }

          const update = await prisma.documentBudget.update({
               where: {
                    id: id,
               },
               data: {
                    productCategory,
                    product,
                    amount,
                    priceUnit,
                    priceTotal
               }
          })

          res.status(201).json({ success: true, data: update })
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }
}


export const updateRisk = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const { riskDescription, mitigationStrategy, riskLevel, affectionLevel } = req.body

          const find = await prisma.riskAssessment.findFirst({
               include: {
                    document: true
               }
          })

          if (find?.document.state !== DocumentStateEnum.DENY) {
               res.status(403).json({ success: false, error: "Already sent document" })
               return
          }

          const update = await prisma.riskAssessment.update({
               where: {
                    id: id
               },
               data: {
                    riskDescription,
                    riskLevel,
                    affectionLevel,
                    mitigationStrategy
               }
          })
          res.status(201).json({ success: true, data: update })
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }
}


export const updateCase = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const { category, types, steps, result, division } = req.body

          const find = await prisma.testCase.findFirst({
               include: {
                    document: true
               }
          })

          if (find?.document.state !== DocumentStateEnum.DENY) {
               res.status(403).json({ success: false, error: "Already sent document" })
               return
          }

          const update = await prisma.testCase.update({
               where: {
                    id: id
               },
               data: {
                    category,
                    types,
                    steps,
                    result,
                    division
               }
          })

          res.status(201).json({ success: true, data: update })
     } catch (error) {
          res.status(500).json({ success: false, message: error });
     }
}

export const testcaseDetailupdate = async (req: Request, res: Response) => {
     try {
          const { id } = req.params;
          const { testType } = req.body;

          const find = await prisma.testCase.findFirst({
               include: {
                    document: true
               }
          })

          if (find?.document.state !== DocumentStateEnum.DENY) {
               res.status(403).json({ success: false, error: "Already sent document" })
               return
          }
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
