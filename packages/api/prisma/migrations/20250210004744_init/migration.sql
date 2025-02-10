/*
  Warnings:

  - You are about to drop the column `generate` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `EmployeePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_empl` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "DocumentStateEnum" ADD VALUE 'FORWARD';

-- DropForeignKey
ALTER TABLE "_empl" DROP CONSTRAINT "_empl_A_fkey";

-- DropForeignKey
ALTER TABLE "_empl" DROP CONSTRAINT "_empl_B_fkey";

-- DropIndex
DROP INDEX "Document_generate_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "generate";

-- DropTable
DROP TABLE "EmployeePermission";

-- DropTable
DROP TABLE "_empl";

-- CreateTable
CREATE TABLE "_user_document" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_user_document_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_user_document_B_index" ON "_user_document"("B");

-- AddForeignKey
ALTER TABLE "_user_document" ADD CONSTRAINT "_user_document_A_fkey" FOREIGN KEY ("A") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_document" ADD CONSTRAINT "_user_document_B_fkey" FOREIGN KEY ("B") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
