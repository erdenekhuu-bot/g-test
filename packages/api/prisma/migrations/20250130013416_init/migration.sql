-- CreateEnum
CREATE TYPE "roles" AS ENUM ('editor', 'accessor', 'zahiral');

-- CreateEnum
CREATE TYPE "predicts" AS ENUM ('normal', 'easily', 'high');

-- CreateEnum
CREATE TYPE "riskeffects" AS ENUM ('normal', 'easily', 'high');

-- CreateEnum
CREATE TYPE "tests" AS ENUM ('gb', 'mb');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('pending', 'accessed', 'denied');

-- CreateEnum
CREATE TYPE "shalguur" AS ENUM ('tutgelzuuleh', 'ehluuleh');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "role" "roles" NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "purpose" JSONB NOT NULL,
    "title" JSONB NOT NULL,
    "statusinfo" "status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "profile" JSONB NOT NULL,
    "role" "roles" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultPrediction" (
    "id" SERIAL NOT NULL,
    "result" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "ResultPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" SERIAL NOT NULL,
    "risk" JSONB NOT NULL,
    "level" "predicts" NOT NULL,
    "effect" "riskeffects" NOT NULL,
    "reduce" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependence" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Dependence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "standby" JSONB NOT NULL,
    "process" JSONB NOT NULL,
    "finall" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutgelzuuleh" (
    "id" SERIAL NOT NULL,
    "type" "shalguur" NOT NULL,
    "shalguur" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Tutgelzuuleh_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_position_key" ON "Profile"("position");

-- CreateIndex
CREATE UNIQUE INDEX "Document_purpose_key" ON "Document"("purpose");

-- CreateIndex
CREATE UNIQUE INDEX "Document_title_key" ON "Document"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_profile_key" ON "Schedule"("profile");

-- CreateIndex
CREATE UNIQUE INDEX "Level_standby_key" ON "Level"("standby");

-- CreateIndex
CREATE UNIQUE INDEX "Level_process_key" ON "Level"("process");

-- CreateIndex
CREATE UNIQUE INDEX "Level_finall_key" ON "Level"("finall");

-- CreateIndex
CREATE UNIQUE INDEX "Tutgelzuuleh_shalguur_key" ON "Tutgelzuuleh"("shalguur");

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

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultPrediction" ADD CONSTRAINT "ResultPrediction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependence" ADD CONSTRAINT "Dependence_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutgelzuuleh" ADD CONSTRAINT "Tutgelzuuleh_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testorchin" ADD CONSTRAINT "Testorchin_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testcase" ADD CONSTRAINT "Testcase_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
