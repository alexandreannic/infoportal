/*
  Warnings:

  - You are about to drop the column `accessLevel` on the `ApplicationAccess` table. All the data in the column will be lost.
  - Added the required column `level` to the `ApplicationAccess` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationAccessLevel" AS ENUM ('READ', 'WRITE', 'ADMIN');

-- AlterTable
ALTER TABLE "ApplicationAccess" DROP COLUMN "accessLevel",
ADD COLUMN     "level" "ApplicationAccessLevel" NOT NULL;
