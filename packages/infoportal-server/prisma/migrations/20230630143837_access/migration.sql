-- AlterTable
ALTER TABLE "MpcaPaymentTool" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ApplicationAccess" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "applicationParam" JSONB,
    "accessLevel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ApplicationAccess_pkey" PRIMARY KEY ("id")
);
