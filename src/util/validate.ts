import * as v from "valibot";

export const DocumentSchema = v.object({
  authuserId: v.number(),
  title: v.string(),
  intro: v.string(),
  aim: v.string(),
  departmentEmployeeRole: v.optional(
    v.array(
      v.object({
        departmentId: v.number(),
        roleId: v.string(),
      })
    )
  ),
});

export const AttributeSchema = v.object({
  attributeData: v.array(
    v.object({
      categoryMain: v.string(),
      category: v.string(),
      value: v.string(),
      documentId: v.number(),
    })
  ),
});

export const BudgetSchema = v.array(
  v.object({
    productCategory: v.string(),
    product: v.string(),
    priceUnit: v.number(),
    priceTotal: v.number(),
    amount: v.number(),
    documentId: v.number(),
  })
);

export const TeamSchema = v.array(
  v.object({
    employeeId: v.number(),
    role: v.string(),
    startedDate: v.date(),
    endDate: v.date(),
    documentId: v.number(),
  })
);

export const RiskSchema = v.array(
  v.object({
    affectionLevel: v.string(),
    mitigationStrategy: v.string(),
    riskDescription: v.string(),
    riskLevel: v.string(),
    documentId: v.number(),
  })
);
