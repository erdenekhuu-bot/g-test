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
