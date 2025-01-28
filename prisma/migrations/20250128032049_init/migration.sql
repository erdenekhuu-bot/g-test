-- CreateEnum
CREATE TYPE "roles" AS ENUM ('editor', 'accessor');

-- CreateEnum
CREATE TYPE "predicts" AS ENUM ('normal', 'easily', 'high');

-- CreateEnum
CREATE TYPE "riskeffects" AS ENUM ('normal', 'easily', 'high');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "role" "roles" NOT NULL,
    "userId" INTEGER NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "purpose" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "profile" TEXT NOT NULL,
    "role" "roles" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultPrediction" (
    "id" SERIAL NOT NULL,
    "result" JSONB NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "ResultPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Risk" (
    "id" SERIAL NOT NULL,
    "risk" VARCHAR(255) NOT NULL,
    "level" "predicts" NOT NULL,
    "effect" "riskeffects" NOT NULL,
    "reduce" VARCHAR(255) NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependence" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "Dependence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "standby" JSONB NOT NULL,
    "process" JSONB NOT NULL,
    "finall" JSONB NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutgelzuuleh" (
    "id" SERIAL NOT NULL,
    "deny" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tutgelzuuleh_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Risk_risk_key" ON "Risk"("risk");

-- CreateIndex
CREATE UNIQUE INDEX "Risk_reduce_key" ON "Risk"("reduce");

-- CreateIndex
CREATE UNIQUE INDEX "Tutgelzuuleh_deny_key" ON "Tutgelzuuleh"("deny");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultPrediction" ADD CONSTRAINT "ResultPrediction_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependence" ADD CONSTRAINT "Dependence_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
