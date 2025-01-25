/*
  Warnings:

  - You are about to drop the column `education_level` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "education_level",
ADD COLUMN     "educationLevel" TEXT;
