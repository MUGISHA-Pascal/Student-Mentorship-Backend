-- DropForeignKey
ALTER TABLE "Coach" DROP CONSTRAINT "Coach_userId_fkey";

-- AddForeignKey
ALTER TABLE "Coach" ADD CONSTRAINT "Coach_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
