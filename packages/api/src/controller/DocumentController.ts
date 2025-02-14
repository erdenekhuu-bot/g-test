import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ValidateExpression } from "../schema/validation";
import { TestcaseEnum } from "@prisma/client";
const prisma = new PrismaClient();

export const filter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { generate, firstname, pagination, statement } = req.body

    const paginationOptions = {
      skip: pagination && pagination.page ? (pagination.page - 1) * (pagination.pageSize || 10) : 0,
      take: pagination && pagination.pageSize ? pagination.pageSize : 10,
    };

    const employees = firstname ? await prisma.employee.findMany({
      where: { firstname: { contains: firstname } },
      include: { authUser: true }
    }) : [];


    const doc = await prisma.document.findMany({
      ...paginationOptions,
      where: {
        ...(generate
          ? { generate: { contains: generate } }
          : {}
        ),
        ...(statement
          ? { statement: { contains: statement } }
          : {}
        ),
        ///dsadsadsadsad
        authuserId:
          employees.length > 0 ?
            {
              in: [...employees.map(e => e.authUser?.id).filter(e => e != null)],
            } : {
            },
      },
      include: {
        user: {
          include: {
            employee: {
              select: {
                lastname: true,
                firstname: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: doc,
      count: await prisma.document.count({
        where: {
          ...(generate
            ? { generate: { contains: generate } }
            : {}
          ),
          ...(statement
            ? { statement: { contains: statement } }
            : {}
          ),
          authuserId:
            employees.length > 0 ?
              {
                in: [...employees.map(e => e.authUser?.id).filter(e => e != null)],
              } : {
              },
        },
      }),
      page: paginationOptions.skip,
      pageSize: paginationOptions.take
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error,
    });
  }
};

export const viewDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const record = await prisma.document.findFirst({
      where: {
        id: parsedId,
      },
      include: {
        attribute: true,
        riskassessment: true,
        testcase: true,
        budget: true,
        userData: true,
        detail: true,
        test: true,
        schedule: {
          include: {
            employee: true,
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
    const { intro, aim, title, state, authuserId } = req.body;

    const user = await prisma.employee.findUnique({
      where: {
        authUserId: authuserId
      }
    })
    if (user) {
      const department = await prisma.department.findUnique({
        where: {
          id: user.departmentId
        }
      })

      if (department && department.name) {
        const initials = department.name
          .split(" ")
          .map(word => word.charAt(0).toUpperCase())
          .join("");

        const text = "-ТӨ-" + initials;
        const lastDocument = await prisma.document.findFirst({
          orderBy: { generate: "desc" }
        });

        const lastNumber = lastDocument?.generate
          ? parseInt(lastDocument.generate.replace(text, ""), 10)
          : 0;

        const generate = String(lastNumber + 1).padStart(3, "0") + text;

        const document = await prisma.document.create({
          data: {
            authuserId,
            generate,
            title,
            state: state.toUpperCase(),
          },
        });

        const createdetail = await prisma.documentDetail.create({
          data: {
            intro,
            aim,
            documentId: document.id,
          },
        })
        res.status(201).json({
          success: true,
          data: document,
        });
      } else {
        res.status(500).json({ success: false, data: "department name in not null", });
      }
    } else {
      res.status(500).json({ success: false, data: "department in not null", });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error, });
  }
};

export const step1create = async (req: Request, res: Response) => {
  try {
    const { id } = (req.params);
    const parsedId = parseInt(id);
    const { employeeId, jobPositionId, role, firstname } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: parsedId,
      },
    });

    const employees = await prisma.employee.findMany({
      where: firstname ? { firstname: { contains: firstname } } : undefined
    });

    const selectedEmployeeId = employees.length > 0 ? employees[0].id : null;
    const selectedJobPositionId = employees.length > 0 ? employees[0].jobPositionId : null;
    const SelectedDepartmentId = employees.length > 0 ? employees[0].departmentId : null;
    if (selectedEmployeeId || selectedJobPositionId || SelectedDepartmentId) {
      if (id) {
        if (document) {
          const object = {
            employeeId: selectedEmployeeId ?? 0,
            jobPositionId: selectedJobPositionId ?? 0,
            departmentId: SelectedDepartmentId ?? 0,
            role,
            documentId: document.id,
          }
          // const list = data.map((model: any) => ({
          //   employeeId: model.employeeId,
          //   jobPositionId: model.jobPositionId,
          //   role: model.role,
          //   documentId: document.id
          // }));

          const createstep = await prisma.test.create({
            data: object
          });

          res.status(201).json({
            success: true,
            data: createstep,
            test: await prisma.test.findMany({
              where: {
                id: createstep.id
              },
              include: {
                department: {
                  select: {
                    name: true
                  }
                },
                jobPosition: {
                  select: {
                    name: true
                  }
                },
              }
            }),
          });
        } else {
          res.status(400).json({ success: false, message: "Document not found" });
        }
      } else {
        res.status(400).json({ success: false, message: "id not found" });
      }
    } else {
      res.status(400).json({ success: false, message: "firstname not found" });
    }

  } catch (error) {
    res.status(500).json({ success: false, data: error, });
  }
}

export const attribute = async (req: Request, res: Response) => {
  try {
    const { id } = (req.params);
    const parsedId = parseInt(id);
    const { orderIndex, category, value, categoryMain } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: parsedId
      }
    })
    if (document) {
      const createAttribute = await prisma.documentAttribute.create({
        data: {
          categoryMain,
          category,
          value,
          orderIndex,
          documentId: document.id
        }
      })
      res.status(201).json({
        success: true,
        data: createAttribute,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error, });
  }
}

export const risk = async (req: Request, res: Response) => {
  try {
    const { id } = (req.params);
    const parsedId = parseInt(id);
    const { riskDescription, riskLevel, affectionLevel, mitigationStrategy } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: parsedId
      }
    });
    if (document) {
      const risk = await prisma.riskAssessment.create({
        data: {
          riskDescription,
          riskLevel,
          affectionLevel,
          mitigationStrategy,
          documentId: document.id
        }
      })
      res.status(201).json({
        success: true,
        data: risk,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}

export const budget = async (req: Request, res: Response) => {
  try {
    const { id } = (req.params);
    const parsedId = parseInt(id);
    const { productCategory, product, amount, priceUnit, priceTotal } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: parsedId
      }
    });

    if (document) {
      const budget = await prisma.documentBudget.create({
        data: {
          productCategory,
          product,
          amount,
          priceUnit,
          priceTotal,
          documentId: document.id
        }
      });
      res.status(201).json({
        success: true,
        data: budget,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}

export const testteam = async (req: Request, res: Response) => {
  try {
    const { id } = (req.params);
    const parsedId = parseInt(id);
    const { employeeId, jobPositionId, role, startedDate, endDate } = req.body;

    const document = await prisma.document.findUnique({
      where: {
        id: parsedId
      }
    });

    if (document) {
      const testteam = await prisma.documentEmployee.create({
        data: {
          employeeId,
          jobPositionId,
          role,
          startedDate,
          endDate,
          documentId: document.id
        }
      });
      res.status(201).json({
        success: true, data: testteam,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}

export const testcase = async (req: Request, res: Response) => {
  try {
    const { id } = (req.params);
    const parsedId = parseInt(id);
    const { category, types, steps, result, division, testType } = req.body;

    if (!id) {
      res.status(444).json({ success: false, message: "not found Id !!!" })
    }
    const document = await prisma.document.findUnique({
      where: {
        id: parsedId
      }
    });
    if (document) {
      const testcase = await prisma.testCase.create({
        data: {
          category,
          types,
          steps,
          result,
          division,
          testType: TestcaseEnum.CREATED,
          documentId: document.id
        }
      })
      res.status(201).json({
        success: true, data: testcase,
      });
    } else {
      res.status(400).json({ success: false, message: "Document not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}

export const tesctDesc = async (req: Request, res: Response) => {
  try {
    const { id } = (req.params);
    const { startedDescription, endedDescription } = req.body;

    const check = await prisma.testCase.findUnique({
      where: {
        id: id
      }
    })
    if (check?.testType === "STARTED") {
      const create = await prisma.tesctCaseDes.create({
        data: {
          startedDescription,
          testCaseId: check.id
        }
      })
      res.status(201).json({ status: true, data: create })
    } else if (check?.testType === "ENDED") {
      const create = await prisma.tesctCaseDes.create({
        data: {
          endedDescription,
          testCaseId: check.id
        }
      })
      res.status(201).json({ success: true, data: create });
    } else {
      res.status(400).json({ succes: false, error: "error" })
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error })
  }

}

export const state = async (req: Request, res: Response) => {
  try {
    const { authuserId, state, pagination, generate, statement } = req.body;
    const employee = await prisma.employee.findUnique({
      where: {
        authUserId: authuserId
      }
    })
    if (!employee) {
      res.status(404).json({ success: false, message: "employee not found" })
    }
    const paginationOptions = {
      skip: pagination && pagination.page ? (pagination.page - 1) * (pagination.pageSize || 10) : 0,
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

    const test = await prisma.test.findMany({
      ...paginationOptions,
      where: whereCondition,
      include: {
        document: true
      },
    });
    const totalCount = await prisma.test.count({
      where: whereCondition
    });
    res.status(201).json({
      success: true,
      data: test,
      count: totalCount,
      page: paginationOptions.skip,
      pageSize: paginationOptions.take
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}

export const team = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = await prisma.documentEmployee.findMany({
      where: {
        documentId: parseInt(id)
      },
      select: {
        document: {
          select: {
            title: true,
            testcase: {
              select: {
                category: true,
                steps: true
              }
            }
          }
        },
        employee: {
          select: {
            firstname: true,
            lastname: true
          }
        },
      }
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

    res.status(201).json({ success: true, data: groupedData })
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}


// export const team = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//   } catch (error) {

//   }
// }

// export const team = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//   } catch (error) {

//   }
// }
