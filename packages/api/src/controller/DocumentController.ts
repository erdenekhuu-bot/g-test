import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ValidateExpression } from "../schema/validation";
import { TestcaseEnum } from "@prisma/client";
import { DocumentStateEnum } from "@prisma/client"
import { filterDepartment } from "../usable/use";

const prisma = new PrismaClient();

export const filter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { generate, firstname, pagination, statement, authUserId } = req.body;

    const paginationOptions = {
      skip:
        pagination && pagination.page
          ? (pagination.page - 1) * (pagination.pageSize || 10)
          : 0,
      take: pagination && pagination.pageSize ? pagination.pageSize : 10,
    };

    const employees = firstname
      ? await prisma.employee.findMany({
        where: { firstname: { contains: firstname } },
        include: { authUser: true },
      })
      : [];

    const doc = await prisma.document.findMany({
      ...paginationOptions,
      where: {
        state: "DENY",
        ...(generate ? { generate: { contains: generate } } : {}),
        ...(statement ? { statement: { contains: statement } } : {}),
        authUserId:
          employees.length > 0
            ? {
              in: [
                ...employees
                  .map((e) => e.authUser?.id)
                  .filter((e) => e != null),
              ],
            }
            : {},
      },
      include: {
        user: {
          select: {
            employee: {
              select: {
                lastname: true,
                firstname: true,
              },
            },
          },
        },
      },
    });

    const filteredDocs = doc.filter((d) => d.authUserId === authUserId);
    const totalCount = filteredDocs.length;
    res.json({
      success: true,
      data: filteredDocs,
      count: totalCount,
      page: paginationOptions.skip,
      pageSize: paginationOptions.take,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error,
    });
  }
};

export const viewDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    // const parsedId = parseInt(id);
    const record = await prisma.document.findFirst({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        detail: true,
        attribute: true,
        budget: true,
        riskassessment: true,
        testcase: {
          include: {
            testCaseDes: true,
            testCaseImage: true,
          },
        },
        documentemployee: {
          include: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
           
          },
        },
        departmentEmployeeRole: {
          include: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error,
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const {data} = req.body;
    const user = await prisma.employee.findUnique({
      where: {
        authUserId: data.authuserId,
      },
    });

    if(!user){
      res.send("Ажилтан олдсонгүй")
    }

    const department = await prisma.department.findUnique({
        where: {
          id: user?.departmentId,
        },
    });

    const initials = filterDepartment(department?.name);
    const text = "-ТӨ-" + initials;
    const lastDocument = await prisma.document.findFirst({
        orderBy: { generate: "desc" },
    });

    const lastNumber = lastDocument?.generate
          ? parseInt(lastDocument.generate.replace(text, ""), 10)
          : 0;

    const generate = String(lastNumber + 1).padStart(3, "0") + text;

    const document = await prisma.document.create({
          data: {
            authUserId: data.authuserId,
            generate,
            title: data.title,
            state: DocumentStateEnum.DENY,
            detail: {
              create: {
                 intro: data.intro,
                 aim: data.aim
              }
            }
          },
        });

    // const documentemp = data.employee.map((n:any, index:number) => ({
    //     employee: n,
    //     names: data.level[index],
    //     roles: data.value[index],
    //     documentId: document.id, 
    // }));

    // const employee =  await prisma.documentEmployee.createMany({
    //   data: documentemp,
    //   skipDuplicates: true
    // });

    if(document){
          await prisma.document.update({
            where: {
              id: document.id,
            },
            data: {
              isFull: 0
          }
      })
    }
    res.json({
      success: true,
      data: req.body
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, data: error });
  }
  // try {
  //   const { intro, aim, title, state, authuserId } = req.body;

  //   const user = await prisma.employee.findUnique({
  //     where: {
  //       authUserId: authuserId,
  //     },
  //   });
  //   if (user) {
  //     const department = await prisma.department.findUnique({
  //       where: {
  //         id: user.departmentId,
  //       },
  //     });

  //     if (department && department.name) {
  //       const initials = department.name
  //         .split(" ")
  //         .map((word) => word.charAt(0).toUpperCase())
  //         .join("");

  //       const text = "-ТӨ-" + initials;
  //       const lastDocument = await prisma.document.findFirst({
  //         orderBy: { generate: "desc" },
  //       });

  //       const lastNumber = lastDocument?.generate
  //         ? parseInt(lastDocument.generate.replace(text, ""), 10)
  //         : 0;

  //       const generate = String(lastNumber + 1).padStart(3, "0") + text;

  //       const document = await prisma.document.create({
  //         data: {
  //           authUserId: authuserId,
  //           generate,
  //           title,
  //           isFull: 1,
  //           state: DocumentStateEnum.DENY,
  //         },
  //       });

  //       const createdetail = await prisma.documentDetail.create({
  //         data: {
  //           intro,
  //           aim,
  //           documentId: document.id,
  //         },
  //       });
  //       if(createdetail){
  //         await prisma.document.update({
  //           where: {
  //             id: document.id,
  //           },
  //           data: {
  //             isFull: 0
  //           }
  //         })
  //       }
  //       res.status(201).json({
  //         success: true,
  //         data: document,
  //       });
  //     } else {
  //       res
  //         .status(500)
  //         .json({ success: false, data: "department name in not null" });
  //     }
  //   } else {
  //     res.status(500).json({ success: false, data: "department in not null" });
  //   }
  // } catch (error) {
  //   res.status(500).json({ success: false, data: error });
  // }
};

export const step1create = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const parsedId = parseInt(id);
    const { employeeId, role } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: id,
      },
    });
    if (!document) {
      res.status(404).json({ success: false, message: "Document not found." });
      return
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId
      },
      include: {
        jobPosition: {
          select: {
            name: true
          }
        },
      }
    })
    const checkEmployee = await prisma.departmentEmployeeRole.findFirst({
      where: {
        documentId: document?.id,
        employeeId: employeeId,
      },
    });
    
    if (checkEmployee) {
      res.status(400).json({ success: false, message: "This employee is already registered for this document." });
    }

    if (employee?.jobPosition?.name?.toLowerCase().includes("дарга")) {
      const createstep = await prisma.departmentEmployeeRole.create({
        data: {
          employeeId: employee?.id,
          jobPositionId: employee?.jobPositionId,
          departmentId: employee?.departmentId,
          role,
          state: DocumentStateEnum.DENY,
          permissionLvl: 4,
          documentId: document.id,
          timeCreated: new Date(),
        },
      });
      if(createstep){
        await prisma.document.update({
          where: {
            id: id,
          },
          data: {
            isFull: 2
          }
        })
      }
      const list = await prisma.departmentEmployeeRole.findMany({
        where: {
          documentId: id,
        },
        include: {
          employee: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          jobPosition: {
            select: {
              name: true,
            },
          },
          department: {
            select: {
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        data1: createstep,
        list: list,
      });
    } else if (employee?.jobPosition?.name?.toLocaleLowerCase().includes("захирал")) {
      const list = await prisma.departmentEmployeeRole.findMany({
        where: {
          documentId: id,
        },
        include: {
          employee: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          jobPosition: {
            select: {
              name: true,
            },
          },
          department: {
            select: {
              name: true,
            },
          },
        },
      });

      if (employee?.id === 185 || employee?.id === 363) {
        const createstep = await prisma.departmentEmployeeRole.create({
          data: {
            employeeId: employee?.id,
            jobPositionId: employee?.jobPositionId,
            departmentId: employee?.departmentId,
            role,
            state: DocumentStateEnum.DENY,
            permissionLvl: 2,
            documentId: document?.id,
            timeCreated: new Date(),
          },
        });

        res.status(201).json({
          success: true,
          data2: createstep,
          list: list,
        });
      } else if (employee?.id === 111) {
        const createstep = await prisma.departmentEmployeeRole.create({
          data: {
            employeeId: employee?.id,
            jobPositionId: employee?.jobPositionId,
            departmentId: employee?.departmentId,
            role,
            state: DocumentStateEnum.DENY,
            permissionLvl: 1,
            documentId: document.id,
            timeCreated: new Date(),
          },
        });

        res.status(201).json({
          success: true,
          data3: createstep,
          list: list,
        });
      } else {
        const createstep = await prisma.departmentEmployeeRole.create({
          data: {
            employeeId: employee?.id,
            jobPositionId: employee?.jobPositionId,
            departmentId: employee?.departmentId,
            role,
            state: DocumentStateEnum.DENY,
            permissionLvl: 3,
            documentId: document.id,
            timeCreated: new Date(),
          },
        });

        res.status(201).json({
          success: true,
          data4: createstep,
          list: list,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error });
  }
};

export const attribute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const parsedId = parseInt(id);
    const { orderIndex, category, value, categoryMain } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: id,
      },
    });
    if (document) {
      const createAttribute = await prisma.documentAttribute.create({
        data: {
          categoryMain,
          category,
          value,
          orderIndex,
          documentId: document.id,
        },
      });
      await prisma.document.update({
        where: {
          id: id,
        },
        data: {
          isFull: 1
        }
      })
      const list = await prisma.documentAttribute.findMany({
        where: {
          documentId: id,
        },
      });
      res.status(201).json({
        success: true,
        data: createAttribute,
        list: list,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error });
  }
};

export const risk = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const parsedId = parseInt(id);
    const { riskDescription, riskLevel, affectionLevel, mitigationStrategy } =
      req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: id,
      },
    });
    if (document) {
      const risk = await prisma.riskAssessment.create({
        data: {
          riskDescription: riskDescription || null,
          riskLevel: riskLevel || null,
          affectionLevel: affectionLevel || null,
          mitigationStrategy: mitigationStrategy || null,

          documentId: document.id,
        },
      });
      await prisma.document.update({
        where: {
          id: id,
        },
        data: {
          isFull: 1
        }
      })
      const list = await prisma.riskAssessment.findMany({
        where: {
          documentId: id,
        },
      });
      res.status(201).json({
        success: true,
        data: risk,
        list: list,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const budget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const parsedId = parseInt(id);
    const { productCategory, product, amount, priceUnit, priceTotal } =
      req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: id,
      },
    });

    if (document) {
      const budget = await prisma.documentBudget.create({
        data: {
          productCategory,
          product,
          amount,
          priceUnit,
          priceTotal,
          documentId: document.id,
        },
      });
      await prisma.document.update({
        where: {
          id: id,
        },
        data: {
          isFull: 1
        }
      })
      const list = await prisma.documentBudget.findMany({
        where: {
          documentId: id,
        },
      });
      res.status(201).json({
        success: true,
        data: budget,
        list: list,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const testteam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // const parsedId = parseInt(id);
    const { employeeId, jobPositionId, role, startedDate, endDate } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: id,
      },
    });

    if (document) {
      const testteam = await prisma.documentEmployee.create({
        data: {
          employeeId,
          jobPositionId,
          role,
          startedDate,
          endDate,
          documentId: document.id,
        },
      });

      await prisma.document.update({
        where: {
          id: id,
        },
        data: {
          isFull: 1
        }
      })
     
      const list = await prisma.documentEmployee.findMany({
        where: {
          documentId: id,
        },
        include: {
          employee: {
            select: {
              lastname: true,
              firstname: true,
            },
          },
          jobPosition: {
            select: {
              name: true,
            },
          },
        },
      });
      res.status(201).json({
        success: true,
        data: testteam,
        list: list,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const testcase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: id,
      },
    });

    // const testcase = data.list.map((n:any, index:number) => ({
    //     list: n,
    //     level: data.level[index],
    //     value: data.value[index],
    //     reportId: data.reportId, 
    // }));
    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    res.status(500).json({ success: false, data: error });
  }
  // try {
  //   const { id } = req.params;
  //   const parsedId = parseInt(id);
  //   const { category, types, steps, result, division, testType } = req.body;

  //   if (!id) {
  //     res.status(444).json({ success: false, message: "not found Id !!!" });
  //   }
  //   const document = await prisma.document.findUnique({
  //     where: {
  //       id: parsedId,
  //     },
  //   });
  //   if (document) {
  //     const testcase = await prisma.testCase.create({
  //       data: {
  //         category,
  //         types,
  //         steps,
  //         result,
  //         division,
  //         testType: TestcaseEnum.CREATED,
  //         documentId: document.id,
  //       },
  //     });
  //     await prisma.document.update({
  //       where: {
  //         id: parsedId,
  //       },
  //       data: {
  //         isFull: 2
  //       }
  //     })
  //     const list = await prisma.testCase.findMany({
  //       where: {
  //         documentId: parsedId,
  //       },
  //     });
  //     res.status(201).json({
  //       success: true,
  //       data: testcase,
  //       list: list,
  //     });
  //   } else {
  //     res.status(400).json({ success: false, message: "Document not found" });
  //   }
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error });
  // }
};

export const tesctDesc = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startedDescription, endedDescription } = req.body;

    const check = await prisma.testCase.findUnique({
      where: {
        id: id,
      },
    });
    if (check?.testType === "STARTED") {
      const create = await prisma.tesctCaseDes.create({
        data: {
          startedDescription,
          testCaseId: check.id,
        },
      });
      res.status(201).json({ status: true, data: create });
    } else if (check?.testType === "ENDED") {
      const create = await prisma.tesctCaseDes.create({
        data: {
          endedDescription,
          testCaseId: check.id,
        },
      });
      res.status(201).json({ success: true, data: create });
    } else {
      res.status(400).json({ succes: false, error: "error" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error });
  }
};

export const state = async (req: Request, res: Response) => {
  try {
    const { authuserId, state, pagination, generate, statement } = req.body;
    const employee = await prisma.employee.findUnique({
      where: {
        authUserId: authuserId,
      },
    });
    if (!employee) {
      res.status(404).json({ success: false, message: "employee not found" });
    }
    const paginationOptions = {
      skip:
        pagination && pagination.page
          ? (pagination.page - 1) * (pagination.pageSize || 10)
          : 0,
      take: pagination && pagination.pageSize ? pagination.pageSize : 10,
    };

    const whereCondition = {
      employeeId: employee?.id,
      document: {
        state: state,
        statement: statement ? { contains: statement } : undefined,
        generate: generate ? { contains: generate } : undefined,
      },
    };

    const test = await prisma.departmentEmployeeRole.findMany({
      ...paginationOptions,
      where: whereCondition,
      include: {
        document: true,
      },
    });
    const totalCount = await prisma.departmentEmployeeRole.count({
      where: whereCondition,
    });
    res.status(201).json({
      success: true,
      data: test,
      count: totalCount,
      page: paginationOptions.skip,
      pageSize: paginationOptions.take,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const team = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = await prisma.documentEmployee.findMany({
      where: {
        documentId: id,
      },
      select: {
        document: {
          select: {
            title: true,
            testcase: {
              select: {
                category: true,
                steps: true,
              },
            },
          },
        },
        employee: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    const groupedData = Object.values(
      team.reduce((acc: any, item: any) => {
        const { document, employee } = item;
        const key = document.title;

        if (!acc[key]) {
          acc[key] = {
            document: { ...document },
            employees: [],
          };
        }

        acc[key].employees.push(employee);
        return acc;
      }, {})
    );

    res.status(201).json({ success: true, data: groupedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
