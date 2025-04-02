/*
  Warnings:

  - The primary key for the `MpcaWfpDeduplicationIdMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MpcaWfpDeduplicationIdMapping` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taxId]` on the table `MpcaWfpDeduplicationIdMapping` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MpcaWfpDeduplication_beneficiaryId_idx";

-- DropIndex
DROP INDEX "MpcaWfpDeduplicationIdMapping_beneficiaryId_idx";

-- AlterTable
ALTER TABLE "MpcaWfpDeduplicationIdMapping" DROP CONSTRAINT "MpcaWfpDeduplicationIdMapping_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "MpcaWfpDeduplicationIdMapping_pkey" PRIMARY KEY ("beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "MpcaWfpDeduplicationIdMapping_taxId_key" ON "MpcaWfpDeduplicationIdMapping"("taxId");

-- AddForeignKey
ALTER TABLE "MpcaWfpDeduplication" ADD CONSTRAINT "MpcaWfpDeduplication_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "MpcaWfpDeduplicationIdMapping"("beneficiaryId") ON DELETE RESTRICT ON UPDATE CASCADE;
