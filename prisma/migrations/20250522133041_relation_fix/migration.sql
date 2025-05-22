/*
  Warnings:

  - You are about to drop the `_CoachStudents` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[coachId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_CoachStudents" DROP CONSTRAINT "_CoachStudents_A_fkey";

-- DropForeignKey
ALTER TABLE "_CoachStudents" DROP CONSTRAINT "_CoachStudents_B_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "coachId" TEXT;

-- DropTable
DROP TABLE "_CoachStudents";

-- CreateIndex
CREATE UNIQUE INDEX "Student_coachId_key" ON "Student"("coachId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE SET NULL ON UPDATE CASCADE;
