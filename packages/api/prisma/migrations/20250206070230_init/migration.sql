-- CreateEnum
CREATE TYPE "DocumentStateEnum" AS ENUM ('DENY', 'ACCESS', 'REJECT');

-- CreateEnum
CREATE TYPE "PermissionKindEnum" AS ENUM ('OPENING', 'CLOSSING');

-- CreateEnum
CREATE TYPE "States" AS ENUM ('PENDING', 'DECLINED', 'ACCESSED');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('EMPLOYEE', 'AUTHOR', 'DISTRIBUTOR');

-- CreateTable
CREATE TABLE "auth_user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50),
    "password" VARCHAR(255),
    "email" VARCHAR(180),
    "mobile" VARCHAR(15),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user_data" (
    "auth_user_id" INTEGER NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "time_updated" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_user_data_pkey" PRIMARY KEY ("auth_user_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "generate" VARCHAR(20) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "state" "DocumentStateEnum" NOT NULL,
    "userCreatedId" INTEGER,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userDataId" INTEGER,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentDetail" (
    "id" TEXT NOT NULL,
    "intro" VARCHAR(200) NOT NULL,
    "aim" VARCHAR(200) NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "DocumentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "kind" "PermissionKindEnum" NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeAction" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "auth_division" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parents_nesting" VARCHAR(255),

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_employee_role" (
    "id" UUID NOT NULL,
    "department_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "role" VARCHAR(30) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_employee_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosition" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "job_group_id" INTEGER,
    "name" VARCHAR(100),
    "description" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_position_group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "job_auth_rank" INTEGER,
    "description" VARCHAR(255),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_position_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "job_position_id" INTEGER,
    "firstname" VARCHAR(80) NOT NULL,
    "lastname" VARCHAR(80) NOT NULL,
    "family_name" VARCHAR(80) NOT NULL,
    "gender" VARCHAR(10),
    "reg_num" VARCHAR(10) NOT NULL,
    "birth_date" DATE NOT NULL,
    "employment_state_id" INTEGER,
    "state_id" INTEGER,
    "auth_user_id" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "note" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_state" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "need_fill_in" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_created_id" INTEGER NOT NULL,
    "time_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAttribute" (
    "id" TEXT NOT NULL,
    "categoryMain" VARCHAR(250) NOT NULL,
    "category" VARCHAR(250) NOT NULL,
    "value" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
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
    "documentId" TEXT NOT NULL,

    CONSTRAINT "DocumentBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEmployee" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" TEXT NOT NULL,
    "riskDescription" TEXT NOT NULL,
    "riskLevel" INTEGER NOT NULL DEFAULT 1,
    "affectionLevel" INTEGER NOT NULL DEFAULT 1,
    "mitigationStrategy" TEXT NOT NULL,
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
    "documentId" TEXT NOT NULL,
    "userCreatedId" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCaseImage" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "testcaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCaseImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypesTest" (
    "id" TEXT NOT NULL,
    "testtype" VARCHAR(100) NOT NULL,

    CONSTRAINT "TypesTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeePermission" (
    "id" TEXT NOT NULL,

    CONSTRAINT "EmployeePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_document" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_document_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_schedules" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_schedules_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_department" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_department_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_jobposition" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_jobposition_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_employees" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_employees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_empl" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_empl_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_generate_key" ON "Document"("generate");

-- CreateIndex
CREATE UNIQUE INDEX "Document_title_key" ON "Document"("title");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentDetail_intro_aim_key" ON "DocumentDetail"("intro", "aim");

-- CreateIndex
CREATE UNIQUE INDEX "employee_reg_num_key" ON "employee"("reg_num");

-- CreateIndex
CREATE UNIQUE INDEX "employee_auth_user_id_key" ON "employee"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentAttribute_categoryMain_category_value_orderIndex_key" ON "DocumentAttribute"("categoryMain", "category", "value", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "RiskAssessment_riskDescription_mitigationStrategy_key" ON "RiskAssessment"("riskDescription", "mitigationStrategy");

-- CreateIndex
CREATE UNIQUE INDEX "TestCaseImage_file_key" ON "TestCaseImage"("file");

-- CreateIndex
CREATE INDEX "_document_B_index" ON "_document"("B");

-- CreateIndex
CREATE INDEX "_schedules_B_index" ON "_schedules"("B");

-- CreateIndex
CREATE INDEX "_department_B_index" ON "_department"("B");

-- CreateIndex
CREATE INDEX "_jobposition_B_index" ON "_jobposition"("B");

-- CreateIndex
CREATE INDEX "_employees_B_index" ON "_employees"("B");

-- CreateIndex
CREATE INDEX "_empl_B_index" ON "_empl"("B");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userDataId_fkey" FOREIGN KEY ("userDataId") REFERENCES "auth_user_data"("auth_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentDetail" ADD CONSTRAINT "DocumentDetail_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_employee_role" ADD CONSTRAINT "department_employee_role_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_employee_role" ADD CONSTRAINT "department_employee_role_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosition" ADD CONSTRAINT "JobPosition_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosition" ADD CONSTRAINT "JobPosition_job_group_id_fkey" FOREIGN KEY ("job_group_id") REFERENCES "job_position_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "employee_state"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_job_position_id_fkey" FOREIGN KEY ("job_position_id") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAttribute" ADD CONSTRAINT "DocumentAttribute_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentBudget" ADD CONSTRAINT "DocumentBudget_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEmployee" ADD CONSTRAINT "DocumentEmployee_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseImage" ADD CONSTRAINT "TestCaseImage_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document" ADD CONSTRAINT "_document_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document" ADD CONSTRAINT "_document_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_schedules" ADD CONSTRAINT "_schedules_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_schedules" ADD CONSTRAINT "_schedules_B_fkey" FOREIGN KEY ("B") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_department" ADD CONSTRAINT "_department_A_fkey" FOREIGN KEY ("A") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_department" ADD CONSTRAINT "_department_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jobposition" ADD CONSTRAINT "_jobposition_A_fkey" FOREIGN KEY ("A") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jobposition" ADD CONSTRAINT "_jobposition_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_employees" ADD CONSTRAINT "_employees_A_fkey" FOREIGN KEY ("A") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_employees" ADD CONSTRAINT "_employees_B_fkey" FOREIGN KEY ("B") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_empl" ADD CONSTRAINT "_empl_A_fkey" FOREIGN KEY ("A") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_empl" ADD CONSTRAINT "_empl_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
