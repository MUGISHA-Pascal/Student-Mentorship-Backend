/*
  Warnings:

  - You are about to drop the column `email` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Coach` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Coach` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Coach` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Coach` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Coach_email_key";

-- AlterTable
ALTER TABLE "Coach" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Coach_userId_key" ON "Coach"("userId");

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
