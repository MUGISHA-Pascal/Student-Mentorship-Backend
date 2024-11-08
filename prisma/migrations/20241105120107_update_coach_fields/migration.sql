/*
  Warnings:

  - You are about to drop the column `name` on the `Coach` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Coach` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Coach` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Coach` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Coach` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Coach` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coach" DROP COLUMN "name",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "coachId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoachCareers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CoachCareers_AB_unique" ON "_CoachCareers"("A", "B");

-- CreateIndex
CREATE INDEX "_CoachCareers_B_index" ON "_CoachCareers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_email_key" ON "Coach"("email");

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachCareers" ADD CONSTRAINT "_CoachCareers_A_fkey" FOREIGN KEY ("A") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachCareers" ADD CONSTRAINT "_CoachCareers_B_fkey" FOREIGN KEY ("B") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;
