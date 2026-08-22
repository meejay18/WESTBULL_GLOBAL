/*
  Warnings:

  - You are about to drop the column `reference` on the `Registration` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Registration_reference_key";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "reference";
