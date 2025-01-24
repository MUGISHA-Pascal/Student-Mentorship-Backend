-- CreateTable
CREATE TABLE "CoachCV" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "CoachCV_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoachCV" ADD CONSTRAINT "CoachCV_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
