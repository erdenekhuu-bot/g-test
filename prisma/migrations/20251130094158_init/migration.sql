-- CreateEnum
CREATE TYPE "PhoneType" AS ENUM ('POSTPAID', 'PERPAID');

-- CreateEnum
CREATE TYPE "DocumentStateEnum" AS ENUM ('DENY', 'ACCESS', 'REJECT', 'FORWARD', 'PENDING', 'MIDDLE', 'SHARED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "Risk" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "IssueLevel" AS ENUM ('INSANE', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('VIEWED', 'ACCESSED', 'NONVIEWED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ACCESSER', 'VIEWER', 'MIDDLE');

-- CreateEnum
CREATE TYPE "StateTestCase" AS ENUM ('CREATED', 'STARTED', 'ENDED', 'MAINENV', 'TESTENV');

-- CreateEnum
CREATE TYPE "OTP" AS ENUM ('PENDING', 'DENY', 'ACCESS');

-- CreateEnum
CREATE TYPE "EROLE" AS ENUM ('VIEWER', 'DEV', 'REPORT', 'ADMIN', 'SHOWER');

-- CreateEnum
CREATE TYPE "FILETYPE" AS ENUM ('WEB', 'MOBILE');

-- CreateTable
CREATE TABLE "AuthUser" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50),
    "mobile" VARCHAR(15),
    "email" VARCHAR(180),
    "status" VARCHAR(10),
    "otp" INTEGER,
    "checkotp" "OTP" DEFAULT 'DENY',

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
CREATE TABLE "AuthUserData" (
    "auth_user_id" INTEGER NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "time_updated" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthUserData_pkey" PRIMARY KEY ("auth_user_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "title" VARCHAR(500) NOT NULL,
    "generate" VARCHAR(30) NOT NULL,
    "state" "DocumentStateEnum" NOT NULL DEFAULT 'DENY',
    "statement" VARCHAR(500),
    "rejection" JSONB,
    "bank" JSONB,
    "authUserId" INTEGER,
    "userDataId" INTEGER,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isFull" INTEGER DEFAULT 0,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rejection" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "employee" JSONB,

    CONSTRAINT "Rejection_pkey" PRIMARY KEY ("id")
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
    "super" "EROLE" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentEmployeeRole" (
    "id" SERIAL NOT NULL,
    "permission_lvl" INTEGER,
    "state" "DocumentStateEnum" NOT NULL DEFAULT 'DENY',
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "employee_id" INTEGER,
    "rode" BOOLEAN NOT NULL DEFAULT false,
    "documentId" INTEGER NOT NULL,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentEmployeeRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentDetail" (
    "intro" TEXT NOT NULL,
    "aim" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "DocumentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAttribute" (
    "categoryMain" TEXT,
    "category" TEXT,
    "value" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTimed" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "DocumentAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentBudget" (
    "productCategory" VARCHAR(500),
    "product" VARCHAR(500),
    "amount" INTEGER DEFAULT 0,
    "priceUnit" INTEGER DEFAULT 0,
    "priceTotal" INTEGER DEFAULT 0,
    "isFull" INTEGER DEFAULT 0,
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "DocumentBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEmployee" (
    "employeeId" INTEGER NOT NULL,
    "departmentId" INTEGER,
    "jobPositionId" INTEGER,
    "role" TEXT NOT NULL,
    "startedDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "DocumentEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "riskDescription" VARCHAR(500),
    "riskLevel" "Risk",
    "affectionLevel" "Risk",
    "mitigationStrategy" VARCHAR(500),
    "isFull" INTEGER DEFAULT 0,
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "category" TEXT,
    "types" TEXT,
    "steps" TEXT,
    "result" TEXT,
    "division" TEXT,
    "testType" "StateTestCase" NOT NULL DEFAULT 'CREATED',
    "environment" "StateTestCase" NOT NULL DEFAULT 'TESTENV',
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCaseImage" (
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "testCaseId" INTEGER NOT NULL,
    "type" "FILETYPE" NOT NULL DEFAULT 'WEB',

    CONSTRAINT "TestCaseImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "fileName" VARCHAR(200),
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER,
    "reportId" INTEGER,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeAction" TIMESTAMP(3) NOT NULL,
    "kind" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_document" (
    "reportname" TEXT NOT NULL,
    "reportpurpose" TEXT NOT NULL,
    "reportprocessing" TEXT NOT NULL,
    "reportconclusion" TEXT,
    "reportadvice" TEXT,
    "state" "DocumentStateEnum" NOT NULL DEFAULT 'PENDING',
    "isFull" INTEGER DEFAULT 0,
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "rode" JSONB,
    "started" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_budget" (
    "id" SERIAL NOT NULL,
    "total" INTEGER NOT NULL,
    "spent" INTEGER NOT NULL,
    "excess" INTEGER NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "report_budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_team" (
    "name" TEXT NOT NULL,
    "role" VARCHAR(200) NOT NULL,
    "started" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "report_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_issue" (
    "list" TEXT NOT NULL,
    "level" "IssueLevel" NOT NULL DEFAULT 'LOW',
    "value" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "exception" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "report_issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsedPhone" (
    "id" SERIAL NOT NULL,
    "type" "PhoneType" NOT NULL DEFAULT 'PERPAID',
    "phone" VARCHAR(10) NOT NULL,
    "description" TEXT,
    "serial" TEXT,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "UsedPhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareGroup" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "ShareGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareReport" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "ShareReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmPaper" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "startedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endData" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(100),
    "rode" JSONB,
    "check" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConfirmPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmSub" (
    "id" SERIAL NOT NULL,
    "confirmId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "system" VARCHAR(500),
    "description" VARCHAR(500),
    "module" VARCHAR(500),
    "version" VARCHAR(500),
    "jobs" TEXT,
    "title" VARCHAR(200),
    "check" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ConfirmSub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_employee_report" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_employee_report_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EmployeeToPermission" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EmployeeToPermission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_report_document_team" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_report_document_team_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ReportToTestCase" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ReportToTestCase_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rejection_documentId_key" ON "Rejection"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_reg_num_key" ON "Employee"("reg_num");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_auth_user_id_key" ON "Employee"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentDetail_documentId_key" ON "DocumentDetail"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "report_document_documentId_key" ON "report_document"("documentId");

-- CreateIndex
CREATE INDEX "_employee_report_B_index" ON "_employee_report"("B");

-- CreateIndex
CREATE INDEX "_EmployeeToPermission_B_index" ON "_EmployeeToPermission"("B");

-- CreateIndex
CREATE INDEX "_report_document_team_B_index" ON "_report_document_team"("B");

-- CreateIndex
CREATE INDEX "_ReportToTestCase_B_index" ON "_ReportToTestCase"("B");

-- AddForeignKey
ALTER TABLE "JobPosition" ADD CONSTRAINT "JobPosition_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosition" ADD CONSTRAINT "JobPosition_jobGroupId_fkey" FOREIGN KEY ("jobGroupId") REFERENCES "JobPositionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userDataId_fkey" FOREIGN KEY ("userDataId") REFERENCES "AuthUserData"("auth_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rejection" ADD CONSTRAINT "Rejection_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentEmployeeRole" ADD CONSTRAINT "DepartmentEmployeeRole_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentEmployeeRole" ADD CONSTRAINT "DepartmentEmployeeRole_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "TestCaseImage" ADD CONSTRAINT "TestCaseImage_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_document" ADD CONSTRAINT "report_document_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_budget" ADD CONSTRAINT "report_budget_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_team" ADD CONSTRAINT "report_team_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_issue" ADD CONSTRAINT "report_issue_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedPhone" ADD CONSTRAINT "UsedPhone_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareGroup" ADD CONSTRAINT "ShareGroup_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareGroup" ADD CONSTRAINT "ShareGroup_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareReport" ADD CONSTRAINT "ShareReport_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareReport" ADD CONSTRAINT "ShareReport_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmPaper" ADD CONSTRAINT "ConfirmPaper_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmPaper" ADD CONSTRAINT "ConfirmPaper_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmSub" ADD CONSTRAINT "ConfirmSub_confirmId_fkey" FOREIGN KEY ("confirmId") REFERENCES "ConfirmPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmSub" ADD CONSTRAINT "ConfirmSub_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_employee_report" ADD CONSTRAINT "_employee_report_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_employee_report" ADD CONSTRAINT "_employee_report_B_fkey" FOREIGN KEY ("B") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToPermission" ADD CONSTRAINT "_EmployeeToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToPermission" ADD CONSTRAINT "_EmployeeToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_report_document_team" ADD CONSTRAINT "_report_document_team_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentEmployee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_report_document_team" ADD CONSTRAINT "_report_document_team_B_fkey" FOREIGN KEY ("B") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportToTestCase" ADD CONSTRAINT "_ReportToTestCase_A_fkey" FOREIGN KEY ("A") REFERENCES "report_document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReportToTestCase" ADD CONSTRAINT "_ReportToTestCase_B_fkey" FOREIGN KEY ("B") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
