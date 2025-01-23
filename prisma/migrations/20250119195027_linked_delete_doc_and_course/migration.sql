-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_courseId_fkey";

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
