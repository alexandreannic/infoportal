-- CreateTable
CREATE TABLE "KoboAnswers" (
    "id" UUID NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "uuid" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "submission_time" TIMESTAMP(3) NOT NULL,
    "status" TEXT,
    "geolocation" TEXT,
    "answers" JSONB NOT NULL,

    CONSTRAINT "KoboAnswers_pkey" PRIMARY KEY ("id")
);
