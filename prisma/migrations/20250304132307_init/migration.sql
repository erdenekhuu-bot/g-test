-- CreateEnum
CREATE TYPE "DocumentStateEnum" AS ENUM ('DENY', 'ACCESS', 'REJECT', 'FORWARD');

-- CreateEnum
CREATE TYPE "PermissionKindEnum" AS ENUM ('OPENING', 'CLOSSING');

-- CreateEnum
CREATE TYPE "Risk" AS ENUM ('HIGH', 'MEDUIM', 'LOW');

-- CreateEnum
CREATE TYPE "States" AS ENUM ('PENDING', 'DECLINED', 'ACCESSED');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('EMPLOYEE', 'AUTHOR', 'DISTRIBUTOR');

-- CreateEnum
CREATE TYPE "TestcaseEnum" AS ENUM ('CREATED', 'STARTED', 'ENDED');

-- CreateEnum
CREATE TYPE "IssueLevel" AS ENUM ('INSANE', 'HIGH', 'MEDIUM', 'LOW');

-- CreateTable
CREATE TABLE "AuthUser" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50),
    "mobile" VARCHAR(15),
    "email" VARCHAR(180),
    "status" VARCHAR(10),

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "auth_division" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "parents_nesting" VARCHAR(255),
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosition" (
    "id" SERIAL NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "jobGroupId" INTEGER,
    "name" VARCHAR(100),
    "description" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPositionGroup" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "job_auth_rank" INTEGER,
    "description" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobPositionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "job_position_id" INTEGER,
    "firstname" VARCHAR(80) NOT NULL,
    "lastname" VARCHAR(80) NOT NULL,
    "family_name" VARCHAR(80) NOT NULL,
    "gender" VARCHAR(10),
    "reg_num" VARCHAR(10) NOT NULL,
    "birth_date" DATE NOT NULL,
    "state_id" INTEGER,
    "auth_user_id" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_created_id" INTEGER,
    "note" VARCHAR(255),
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeState" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "need_fill_in" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_created_id" INTEGER NOT NULL,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthUserData" (
    "auth_user_id" INTEGER NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "time_updated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthUserData_pkey" PRIMARY KEY ("auth_user_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "generate" VARCHAR(30),
    "state" "DocumentStateEnum" NOT NULL,
    "statement" VARCHAR(50),
    "authUserId" INTEGER,
    "userDataId" INTEGER,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isFull" INTEGER DEFAULT 0,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_employee_role" (
    "id" UUID NOT NULL,
    "department_id" INTEGER,
    "jobPositionId" INTEGER,
    "employee_id" INTEGER,
    "role" VARCHAR(30),
    "documentId" TEXT NOT NULL,
    "state" "DocumentStateEnum" NOT NULL,
    "permission_lvl" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_employee_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentDetail" (
    "id" TEXT NOT NULL,
    "intro" VARCHAR(200) NOT NULL,
    "aim" VARCHAR(100) NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "DocumentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAttribute" (
    "id" TEXT NOT NULL,
    "categoryMain" VARCHAR(250) NOT NULL,
    "category" VARCHAR(250) NOT NULL,
    "value" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimed" TIMESTAMP(3) NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "DocumentAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentBudget" (
    "id" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "priceUnit" INTEGER NOT NULL DEFAULT 0,
    "priceTotal" INTEGER NOT NULL DEFAULT 0,
    "isFull" INTEGER DEFAULT 0,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "DocumentBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEmployee" (
    "id" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "departmentId" INTEGER,
    "jobPositionId" INTEGER,
    "role" VARCHAR(200) NOT NULL,
    "startedDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "documentId" TEXT NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimed" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL,
    "riskDescription" TEXT,
    "riskLevel" "Risk",
    "affectionLevel" "Risk",
    "mitigationStrategy" TEXT,
    "isFull" INTEGER DEFAULT 0,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "types" VARCHAR(100) NOT NULL,
    "steps" TEXT NOT NULL,
    "result" VARCHAR(100) NOT NULL,
    "division" VARCHAR(100) NOT NULL,
    "testType" "TestcaseEnum" NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "documentId" TEXT NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCaseImage" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "testCaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestCaseImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TesctCaseDes" (
    "id" TEXT NOT NULL,
    "startedDescription" TEXT,
    "endedDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testCaseId" TEXT NOT NULL,

    CONSTRAINT "TesctCaseDes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "fileName" VARCHAR(150) NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_document" (
    "id" TEXT NOT NULL,
    "reportname" VARCHAR(200) NOT NULL,
    "reportpurpose" VARCHAR(200) NOT NULL,
    "reportprocessing" TEXT NOT NULL,
    "reportconclusion" VARCHAR(200),
    "reportadvice" VARCHAR(200),
    "isFull" INTEGER DEFAULT 0,

    CONSTRAINT "report_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" VARCHAR(200) NOT NULL,
    "started" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended" TIMESTAMP(3) NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "report_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_issue" (
    "id" TEXT NOT NULL,
    "list" TEXT NOT NULL,
    "level" "IssueLevel" NOT NULL DEFAULT 'LOW',
    "value" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "report_issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_reportcase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_reportcase_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_reg_num_key" ON "Employee"("reg_num");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_auth_user_id_key" ON "Employee"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Document_id_key" ON "Document"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Document_title_generate_statement_key" ON "Document"("title", "generate", "statement");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentDetail_intro_aim_key" ON "DocumentDetail"("intro", "aim");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentAttribute_categoryMain_category_value_orderIndex_key" ON "DocumentAttribute"("categoryMain", "category", "value", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentEmployee_id_key" ON "DocumentEmployee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentEmployee_role_key" ON "DocumentEmployee"("role");

-- CreateIndex
CREATE UNIQUE INDEX "RiskAssessment_riskDescription_mitigationStrategy_key" ON "RiskAssessment"("riskDescription", "mitigationStrategy");

-- CreateIndex
CREATE UNIQUE INDEX "report_document_reportname_reportpurpose_reportprocessing_r_key" ON "report_document"("reportname", "reportpurpose", "reportprocessing", "reportconclusion", "reportadvice", "id");

-- CreateIndex
CREATE UNIQUE INDEX "report_team_id_key" ON "report_team"("id");

-- CreateIndex
CREATE UNIQUE INDEX "report_issue_id_key" ON "report_issue"("id");

-- CreateIndex
CREATE UNIQUE INDEX "report_issue_level_value_key" ON "report_issue"("level", "value");

-- CreateIndex
CREATE INDEX "_reportcase_B_index" ON "_reportcase"("B");

-- AddForeignKey
ALTER TABLE "JobPosition" ADD CONSTRAINT "JobPosition_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosition" ADD CONSTRAINT "JobPosition_jobGroupId_fkey" FOREIGN KEY ("jobGroupId") REFERENCES "JobPositionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userDataId_fkey" FOREIGN KEY ("userDataId") REFERENCES "AuthUserData"("auth_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_employee_role" ADD CONSTRAINT "department_employee_role_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_employee_role" ADD CONSTRAINT "department_employee_role_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_employee_role" ADD CONSTRAINT "department_employee_role_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_employee_role" ADD CONSTRAINT "department_employee_role_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentDetail" ADD CONSTRAINT "DocumentDetail_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAttribute" ADD CONSTRAINT "DocumentAttribute_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentBudget" ADD CONSTRAINT "DocumentBudget_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEmployee" ADD CONSTRAINT "DocumentEmployee_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEmployee" ADD CONSTRAINT "DocumentEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEmployee" ADD CONSTRAINT "DocumentEmployee_jobPositionId_fkey" FOREIGN KEY ("jobPositionId") REFERENCES "JobPosition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseImage" ADD CONSTRAINT "TestCaseImage_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TesctCaseDes" ADD CONSTRAINT "TesctCaseDes_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_team" ADD CONSTRAINT "report_team_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_issue" ADD CONSTRAINT "report_issue_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report_document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reportcase" ADD CONSTRAINT "_reportcase_A_fkey" FOREIGN KEY ("A") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reportcase" ADD CONSTRAINT "_reportcase_B_fkey" FOREIGN KEY ("B") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
