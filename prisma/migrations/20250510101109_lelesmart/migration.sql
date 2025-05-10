/*
  Warnings:

  - Changed the type of `seedCondition` on the `Analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pondCondition` on the `Analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `finalResult` on the `Analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "seedCondition",
ADD COLUMN     "seedCondition" JSONB NOT NULL,
DROP COLUMN "pondCondition",
ADD COLUMN     "pondCondition" JSONB NOT NULL,
DROP COLUMN "finalResult",
ADD COLUMN     "finalResult" JSONB NOT NULL;
