-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "headShape" INTEGER NOT NULL,
    "agility" INTEGER NOT NULL,
    "skinColor" INTEGER NOT NULL,
    "defect" INTEGER NOT NULL,
    "cfHead" DOUBLE PRECISION NOT NULL,
    "cfAgility" DOUBLE PRECISION NOT NULL,
    "cfSkin" DOUBLE PRECISION NOT NULL,
    "cfDefect" DOUBLE PRECISION NOT NULL,
    "ph" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "feedType" INTEGER NOT NULL,
    "seedCondition" TEXT NOT NULL,
    "pondCondition" TEXT NOT NULL,
    "finalResult" TEXT NOT NULL,
    "cfSeed" DOUBLE PRECISION NOT NULL,
    "cfPond" DOUBLE PRECISION NOT NULL,
    "cfFinal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Analysis_createdAt_idx" ON "Analysis"("createdAt");
