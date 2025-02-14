/*
  Warnings:

  - The primary key for the `Document` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userCreatedId` on the `Document` table. All the data in the column will be lost.
  - The `id` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userCreatedId` on the `TestCase` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `TestCaseImage` table. All the data in the column will be lost.
  - The primary key for the `_document` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `TypesTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_user_document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `documentId` on the `DocumentAttribute` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `documentId` on the `DocumentBudget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `documentId` on the `DocumentDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `employeeId` to the `DocumentEmployee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `DocumentEmployee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobPositionId` to the `DocumentEmployee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `DocumentEmployee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedDate` to the `DocumentEmployee` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `documentId` on the `DocumentEmployee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `riskLevel` on the `RiskAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `affectionLevel` on the `RiskAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `documentId` on the `RiskAssessment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `testType` to the `TestCase` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `documentId` on the `TestCase` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Risk" AS ENUM ('HIGH', 'MEDUIM', 'LOW');

-- CreateEnum
CREATE TYPE "TestcaseEnum" AS ENUM ('CREATED', 'STARTED', 'ENDED');

-- DropForeignKey
ALTER TABLE "DocumentAttribute" DROP CONSTRAINT "DocumentAttribute_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentBudget" DROP CONSTRAINT "DocumentBudget_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentDetail" DROP CONSTRAINT "DocumentDetail_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentEmployee" DROP CONSTRAINT "DocumentEmployee_documentId_fkey";

-- DropForeignKey
ALTER TABLE "RiskAssessment" DROP CONSTRAINT "RiskAssessment_documentId_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_documentId_fkey";

-- DropForeignKey
ALTER TABLE "_document" DROP CONSTRAINT "_document_A_fkey";

-- DropForeignKey
ALTER TABLE "_schedules" DROP CONSTRAINT "_schedules_A_fkey";

-- DropForeignKey
ALTER TABLE "_user_document" DROP CONSTRAINT "_user_document_A_fkey";

-- DropForeignKey
ALTER TABLE "_user_document" DROP CONSTRAINT "_user_document_B_fkey";

-- AlterTable
ALTER TABLE "Document" DROP CONSTRAINT "Document_pkey",
DROP COLUMN "userCreatedId",
ADD COLUMN     "authuserId" INTEGER,
ADD COLUMN     "employeeId" INTEGER,
ADD COLUMN     "filEId" INTEGER,
ADD COLUMN     "generate" VARCHAR(30),
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Document_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DocumentAttribute" DROP COLUMN "documentId",
ADD COLUMN     "documentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DocumentBudget" DROP COLUMN "documentId",
ADD COLUMN     "documentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DocumentDetail" DROP COLUMN "documentId",
ADD COLUMN     "documentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DocumentEmployee" ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "jobPositionId" INTEGER NOT NULL,
ADD COLUMN     "role" VARCHAR(200) NOT NULL,
ADD COLUMN     "startedDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "documentId",
ADD COLUMN     "documentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RiskAssessment" DROP COLUMN "riskLevel",
ADD COLUMN     "riskLevel" "Risk" NOT NULL,
DROP COLUMN "affectionLevel",
ADD COLUMN     "affectionLevel" "Risk" NOT NULL,
DROP COLUMN "documentId",
ADD COLUMN     "documentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "userCreatedId",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "testType" "TestcaseEnum" NOT NULL,
DROP COLUMN "documentId",
ADD COLUMN     "documentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TestCaseImage" DROP COLUMN "endedAt";

-- AlterTable
ALTER TABLE "_document" DROP CONSTRAINT "_document_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
ADD CONSTRAINT "_document_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_schedules" DROP CONSTRAINT "_schedules_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
ADD CONSTRAINT "_schedules_AB_pkey" PRIMARY KEY ("A", "B");

-- DropTable
DROP TABLE "TypesTest";

-- DropTable
DROP TABLE "_user_document";

-- DropTable
DROP TABLE "role";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "fileName" VARCHAR(30) NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "jobPositionId" INTEGER NOT NULL,
    "role" VARCHAR(200) NOT NULL,
    "documentId" INTEGER NOT NULL,
    "timeCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeUpdated" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentDetail" ADD CONSTRAINT "DocumentDetail_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "TesctCaseDes" ADD CONSTRAINT "TesctCaseDes_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_document" ADD CONSTRAINT "_document_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_schedules" ADD CONSTRAINT "_schedules_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
