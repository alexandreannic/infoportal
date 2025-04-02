-- CreateTable
CREATE TABLE "MpcaWfpDeduplicationIdMapping" (
    "id" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,

    CONSTRAINT "MpcaWfpDeduplicationIdMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MpcaWfpDeduplication" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "wfpId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "existingOrga" TEXT,
    "existingStart" TIMESTAMP(3),
    "existingEnd" TIMESTAMP(3),
    "existingAmount" INTEGER,

    CONSTRAINT "MpcaWfpDeduplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MpcaWfpDeduplicationIdMapping_beneficiaryId_idx" ON "MpcaWfpDeduplicationIdMapping"("beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "MpcaWfpDeduplicationIdMapping_beneficiaryId_taxId_key" ON "MpcaWfpDeduplicationIdMapping"("beneficiaryId", "taxId");

-- CreateIndex
CREATE INDEX "MpcaWfpDeduplication_beneficiaryId_idx" ON "MpcaWfpDeduplication"("beneficiaryId");
