-- DropForeignKey
ALTER TABLE "MpcaWfpDeduplication" DROP CONSTRAINT "MpcaWfpDeduplication_beneficiaryId_fkey";

-- AlterTable
ALTER TABLE "MpcaWfpDeduplication" ALTER COLUMN "beneficiaryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MpcaWfpDeduplication" ADD CONSTRAINT "MpcaWfpDeduplication_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "MpcaWfpDeduplicationIdMapping"("beneficiaryId") ON DELETE SET NULL ON UPDATE CASCADE;
