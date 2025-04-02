/*
  Warnings:

  - You are about to drop the column `drcJobTitle` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "drcJobTitle",
ADD COLUMN     "drcJob" TEXT;
