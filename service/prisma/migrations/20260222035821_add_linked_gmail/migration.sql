/*
  Warnings:

  - A unique constraint covering the columns `[linkedGmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "linkedGmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_linkedGmail_key" ON "User"("linkedGmail");
