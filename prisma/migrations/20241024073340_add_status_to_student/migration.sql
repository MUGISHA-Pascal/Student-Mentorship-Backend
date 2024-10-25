-- CreateEnum
CREATE TYPE "Status" AS ENUM ('WAITLIST', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'WAITLIST';
