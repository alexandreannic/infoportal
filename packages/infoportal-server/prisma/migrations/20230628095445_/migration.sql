-- AddForeignKey
ALTER TABLE "MpcaWfpDeduplication" ADD CONSTRAINT "MpcaWfpDeduplication_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "MpcaWfpDeduplicationIdMapping"("beneficiaryId") ON DELETE RESTRICT ON UPDATE CASCADE;
