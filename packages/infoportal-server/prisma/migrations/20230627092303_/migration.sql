/*
  Warnings:

  - A unique constraint covering the columns `[wfpId]` on the table `MpcaWfpDeduplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MpcaWfpDeduplication_wfpId_key" ON "MpcaWfpDeduplication"("wfpId");
