-- CreateTable
CREATE TABLE "MpcaFinanceDoc" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MpcaFinanceDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MpcaPaymentToolAnswers" (
    "koboAnswersId" TEXT NOT NULL,
    "mpcaFinanceDocId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MpcaPaymentToolAnswers_pkey" PRIMARY KEY ("koboAnswersId","mpcaFinanceDocId")
);

-- AddForeignKey
ALTER TABLE "MpcaPaymentToolAnswers" ADD CONSTRAINT "MpcaPaymentToolAnswers_koboAnswersId_fkey" FOREIGN KEY ("koboAnswersId") REFERENCES "KoboAnswers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MpcaPaymentToolAnswers" ADD CONSTRAINT "MpcaPaymentToolAnswers_mpcaFinanceDocId_fkey" FOREIGN KEY ("mpcaFinanceDocId") REFERENCES "MpcaFinanceDoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
