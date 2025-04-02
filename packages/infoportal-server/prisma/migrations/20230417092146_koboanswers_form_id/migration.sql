/*
  Warnings:

  - The primary key for the `KoboAnswers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `KoboAnswers` table. All the data in the column will be lost.
  - The required column `formId` was added to the `KoboAnswers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "KoboAnswers" DROP CONSTRAINT "KoboAnswers_pkey",
DROP COLUMN "status",
ADD COLUMN     "formId" UUID NOT NULL,
ADD COLUMN     "validationStatus" TEXT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "KoboAnswers_pkey" PRIMARY KEY ("formId");
