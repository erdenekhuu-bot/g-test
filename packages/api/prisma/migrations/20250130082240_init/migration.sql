-- CreateEnum
CREATE TYPE "DocumentStateEnum" AS ENUM ('DENY', 'ACCESS', 'REJECT');

-- CreateEnum
CREATE TYPE "PermissionKindEnum" AS ENUM ('OPENING', 'CLOSSING');

-- CreateEnum
CREATE TYPE "riskLevel" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "affectionLevel" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "States" AS ENUM ('PENDING', 'DECLINED', 'ACCESSED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserIdAction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserIdAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "state" "DocumentStateEnum" NOT NULL,
    "userCreatedId" INTEGER,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "detailId" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentDetail" (
    "id" SERIAL NOT NULL,
    "intro" VARCHAR(200) NOT NULL,
    "aim" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "kind" "PermissionKindEnum" NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "documentId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "employeeactionId" INTEGER NOT NULL,
    "useridactionid" INTEGER NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeAction" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosition" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeIdAction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeIdAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAttribute" (
    "id" SERIAL NOT NULL,
    "categoryMain" VARCHAR(250) NOT NULL,
    "category" VARCHAR(250) NOT NULL,
    "value" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "DocumentAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentBudget" (
    "id" SERIAL NOT NULL,
    "productCategory" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "priceUnit" INTEGER NOT NULL DEFAULT 0,
    "priceTotal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "DocumentBudget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEmployee" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessment" (
    "id" SERIAL NOT NULL,
    "riskDescription" TEXT NOT NULL,
    "riskLevel" "riskLevel" NOT NULL,
    "affectionLevel" "affectionLevel" NOT NULL,
    "mitigationStrategy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "RiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "state" "States" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "documentId" INTEGER NOT NULL,
    "userCreatedId" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeCreated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCaseImage" (
    "id" SERIAL NOT NULL,
    "file" TEXT NOT NULL,
    "testcaseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCaseImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_jobposition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_jobposition_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_title_key" ON "Document"("title");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentDetail_intro_aim_key" ON "DocumentDetail"("intro", "aim");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentAttribute_categoryMain_category_value_orderIndex_key" ON "DocumentAttribute"("categoryMain", "category", "value", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "RiskAssessment_riskDescription_mitigationStrategy_key" ON "RiskAssessment"("riskDescription", "mitigationStrategy");

-- CreateIndex
CREATE UNIQUE INDEX "TestCaseImage_file_key" ON "TestCaseImage"("file");

-- CreateIndex
CREATE INDEX "_jobposition_B_index" ON "_jobposition"("B");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "DocumentDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_employeeactionId_fkey" FOREIGN KEY ("employeeactionId") REFERENCES "EmployeeIdAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_useridactionid_fkey" FOREIGN KEY ("useridactionid") REFERENCES "UserIdAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAttribute" ADD CONSTRAINT "DocumentAttribute_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentBudget" ADD CONSTRAINT "DocumentBudget_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEmployee" ADD CONSTRAINT "DocumentEmployee_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseImage" ADD CONSTRAINT "TestCaseImage_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jobposition" ADD CONSTRAINT "_jobposition_A_fkey" FOREIGN KEY ("A") REFERENCES "JobPosition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_jobposition" ADD CONSTRAINT "_jobposition_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
