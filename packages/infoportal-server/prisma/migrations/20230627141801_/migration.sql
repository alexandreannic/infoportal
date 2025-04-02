/*
  Warnings:

  - Made the column `beneficiaryId` on table `MpcaWfpDeduplication` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MpcaWfpDeduplication" DROP CONSTRAINT "MpcaWfpDeduplication_beneficiaryId_fkey";

-- AlterTable
ALTER TABLE "MpcaWfpDeduplication" ALTER COLUMN "beneficiaryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "MpcaWfpDeduplication" ADD CONSTRAINT "MpcaWfpDeduplication_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "MpcaWfpDeduplicationIdMapping"("beneficiaryId") ON DELETE RESTRICT ON UPDATE CASCADE;
