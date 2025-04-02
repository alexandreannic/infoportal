-- CreateTable
CREATE TABLE "KoboForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploadedBy" TEXT,

    CONSTRAINT "KoboForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KoboAnswers" ADD CONSTRAINT "KoboAnswers_formId_fkey" FOREIGN KEY ("formId") REFERENCES "KoboForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
