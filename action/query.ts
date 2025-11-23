import { prisma } from "@/action/prisma";

export const mainquery = async (id: number, pageSize: number, page: number) => {
  const result = await prisma.$queryRaw`
        SELECT json_build_object(
                'id', doc.id,
                'generate', doc.generate,
                'title', doc.title,
                'employee', emp.firstname,
                'timeCreated', doc."timeCreated",
                'state', doc.state,
                'papers', COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                        'id', confirm.id
                        )
                    ) FILTER (WHERE confirm.id IS NOT NULL),
                    '[]'::json
                    ),
                'share', COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                    'documentId', shares."documentId"
                    )
                ) FILTER (WHERE shares."documentId" IS NOT NULL),
                '[]'::json
                ),
                'departmentRoles', COALESCE(
                  json_agg(
                    DISTINCT jsonb_build_object(
                      'id', dep.id,
                      'role', dep.role,
                      'state', dep.state
                    )
                  ) FILTER (WHERE dep.id IS NOT NULL),
                  '[]'::json
                )
              ) AS data
            FROM public."Document" AS doc
                LEFT JOIN public."AuthUser" AS authuser ON authuser.id = doc."authUserId"
                LEFT JOIN public."Employee" AS emp ON emp."auth_user_id" = authuser.id
                LEFT JOIN public."ConfirmPaper" AS confirm ON confirm."documentId" = doc.id
                LEFT JOIN public."DepartmentEmployeeRole" AS dep ON dep."documentId" = doc.id
                LEFT JOIN public."ShareGroup" AS shares ON shares."documentId" = doc.id
            WHERE emp.id = ${id}
            GROUP BY doc.id, emp.firstname, doc.generate, doc.title,doc.state
            LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize};
          `;
  return result;
};

export const primequery = async (
  id: number,
  pageSize: number,
  page: number
) => {
  const result = await prisma.$queryRaw`
        SELECT json_build_object(
              'id', doc.id,
              'generate', doc.generate,
              'title', doc.title,
              'state', doc.state,
              'employee', useremployee.firstname,
              'job_auth_rank', jpg."job_auth_rank",
              'timeCreated', doc."timeCreated",
              'papers', COALESCE(
                  json_agg(
                      DISTINCT jsonb_build_object(
                          'id', confirm.id
                      )
                  ) FILTER (WHERE confirm.id IS NOT NULL),
                  '[]'::json
              ),
              'departmentRoles', COALESCE(
                  json_agg(
                      DISTINCT jsonb_build_object(
                          'id', der.id,
                          'role', der.rode,
                          'state', der.state
                      )
                  ) FILTER (WHERE der.id IS NOT NULL),
                  '[]'::json
              )
          ) AS data
          FROM public."Employee" AS emp
          JOIN "JobPosition" AS jp ON emp."job_position_id" = jp.id
          JOIN "JobPositionGroup" AS jpg ON jp."jobGroupId" = jpg.id
          JOIN "Document" AS doc ON doc.id IN (
              SELECT DISTINCT "documentId" 
              FROM "DepartmentEmployeeRole" 
              WHERE "employee_id" = emp.id
          )
          JOIN "AuthUser" AS authuser ON authuser.id = doc."authUserId"
          JOIN "Employee" AS useremployee ON useremployee.auth_user_id = authuser.id
          LEFT JOIN "DepartmentEmployeeRole" AS der ON der."documentId" = doc.id
          LEFT JOIN "ConfirmPaper" AS confirm ON confirm."documentId" = doc.id
          WHERE emp."is_deleted" = false
              AND emp.id = ${id}
              AND doc.state = 'FORWARD'
              AND (
                  jpg."job_auth_rank" = 2
                  OR (
                      jpg."job_auth_rank" = 4 AND NOT EXISTS (
                          SELECT 1
                          FROM "DepartmentEmployeeRole" AS der2
                          JOIN "Employee" AS e2 ON der2."employee_id" = e2.id
                          JOIN "JobPosition" AS jp2 ON e2."job_position_id" = jp2.id
                          JOIN "JobPositionGroup" AS jpg2 ON jp2."jobGroupId" = jpg2.id
                          WHERE der2."documentId" = doc.id AND jpg2."job_auth_rank" = 2 AND der2.rode = false
                      )
                  )
                  OR (
                      jpg."job_auth_rank" = 6 AND NOT EXISTS (
                          SELECT 1
                          FROM "DepartmentEmployeeRole" AS der2
                          JOIN "Employee" AS e2 ON der2."employee_id" = e2.id
                          JOIN "JobPosition" AS jp2 ON e2."job_position_id" = jp2.id
                          JOIN "JobPositionGroup" AS jpg2 ON jp2."jobGroupId" = jpg2.id
                          WHERE der2."documentId" = doc.id AND jpg2."job_auth_rank" IN (2, 4) AND der2.rode = false
                      )
                  )
              )
          GROUP BY
              doc.id, emp.firstname, doc.generate, doc.title, doc.state,
              jpg."job_auth_rank", useremployee.firstname, doc."timeCreated"
            `;
  return result;
};
