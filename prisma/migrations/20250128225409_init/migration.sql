/*
  Warnings:

  - You are about to drop the column `password` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `deny` on the `Tutgelzuuleh` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[standby]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[process]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[finall]` on the table `Level` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shalguur]` on the table `Tutgelzuuleh` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `statusinfo` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `purpose` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `title` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `documentId` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `risk` on the `Risk` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reduce` on the `Risk` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `profile` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `documentId` to the `Tutgelzuuleh` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shalguur` to the `Tutgelzuuleh` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tutgelzuuleh` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tests" AS ENUM ('gb', 'mb');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('pending', 'accessed', 'denied');

-- CreateEnum
CREATE TYPE "shalguur" AS ENUM ('tutgelzuuleh', 'ehluuleh');

-- AlterEnum
ALTER TYPE "roles" ADD VALUE 'zahiral';

-- DropIndex
DROP INDEX "Risk_reduce_key";

-- DropIndex
DROP INDEX "Risk_risk_key";

-- DropIndex
DROP INDEX "Tutgelzuuleh_deny_key";

-- AlterTable
ALTER TABLE "Dependence" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "statusinfo" "status" NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "purpose",
ADD COLUMN     "purpose" JSONB NOT NULL,
DROP COLUMN "title",
ADD COLUMN     "title" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Level" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "documentId" INTEGER NOT NULL,
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "password",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ResultPrediction" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Risk" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "risk",
ADD COLUMN     "risk" JSONB NOT NULL,
DROP COLUMN "reduce",
ADD COLUMN     "reduce" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "deleted_at",
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "profile",
ADD COLUMN     "profile" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Tutgelzuuleh" DROP COLUMN "deny",
ADD COLUMN     "documentId" INTEGER NOT NULL,
ADD COLUMN     "shalguur" JSONB NOT NULL,
ADD COLUMN     "type" "shalguur" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refreshToken" TEXT;

-- CreateTable
CREATE TABLE "Testorchin" (
    "id" SERIAL NOT NULL,
    "bagtsh" TEXT NOT NULL,
    "torol" "tests" NOT NULL,
    "digit" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "totalprice" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Testorchin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testcase" (
    "id" SERIAL NOT NULL,
    "angilal" TEXT NOT NULL,
    "torol" TEXT NOT NULL,
    "alham" JSONB NOT NULL,
    "urdun" TEXT NOT NULL,
    "hariutsah" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Testcase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Testorchin_bagtsh_key" ON "Testorchin"("bagtsh");

-- CreateIndex
CREATE UNIQUE INDEX "Testorchin_digit_key" ON "Testorchin"("digit");

-- CreateIndex
CREATE UNIQUE INDEX "Testorchin_price_key" ON "Testorchin"("price");

-- CreateIndex
CREATE UNIQUE INDEX "Testorchin_totalprice_key" ON "Testorchin"("totalprice");

-- CreateIndex
CREATE UNIQUE INDEX "Testcase_angilal_key" ON "Testcase"("angilal");

-- CreateIndex
CREATE UNIQUE INDEX "Testcase_torol_key" ON "Testcase"("torol");

-- CreateIndex
CREATE UNIQUE INDEX "Testcase_urdun_key" ON "Testcase"("urdun");

-- CreateIndex
CREATE UNIQUE INDEX "Testcase_hariutsah_key" ON "Testcase"("hariutsah");

-- CreateIndex
CREATE UNIQUE INDEX "Document_purpose_key" ON "Document"("purpose");

-- CreateIndex
CREATE UNIQUE INDEX "Document_title_key" ON "Document"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Level_standby_key" ON "Level"("standby");

-- CreateIndex
CREATE UNIQUE INDEX "Level_process_key" ON "Level"("process");

-- CreateIndex
CREATE UNIQUE INDEX "Level_finall_key" ON "Level"("finall");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_profile_key" ON "Schedule"("profile");

-- CreateIndex
CREATE UNIQUE INDEX "Tutgelzuuleh_shalguur_key" ON "Tutgelzuuleh"("shalguur");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutgelzuuleh" ADD CONSTRAINT "Tutgelzuuleh_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testorchin" ADD CONSTRAINT "Testorchin_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testcase" ADD CONSTRAINT "Testcase_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
