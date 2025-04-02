-- AlterTable
ALTER TABLE "FeatureAccess" ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "KoboAnswers" ADD COLUMN     "donorId" TEXT[];

-- CreateTable
CREATE TABLE "KoboProtHhsDonor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answerId" TEXT NOT NULL,
    "donor" TEXT,

    CONSTRAINT "KoboProtHhsDonor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KoboProtHhsDonor" ADD CONSTRAINT "KoboProtHhsDonor_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "KoboAnswers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
