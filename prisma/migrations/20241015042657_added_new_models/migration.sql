-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('UPCOMING', 'ONGOING', 'DONE');

-- CreateTable
CREATE TABLE "Coach" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "ActivityStatus" NOT NULL,
    "image" TEXT,
    "coachId" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoachCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CoachStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CourseStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CoachCourses_AB_unique" ON "_CoachCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_CoachCourses_B_index" ON "_CoachCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CoachStudents_AB_unique" ON "_CoachStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_CoachStudents_B_index" ON "_CoachStudents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseStudents_AB_unique" ON "_CourseStudents"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseStudents_B_index" ON "_CourseStudents"("B");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachCourses" ADD CONSTRAINT "_CoachCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachCourses" ADD CONSTRAINT "_CoachCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachStudents" ADD CONSTRAINT "_CoachStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoachStudents" ADD CONSTRAINT "_CoachStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseStudents" ADD CONSTRAINT "_CourseStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseStudents" ADD CONSTRAINT "_CourseStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;