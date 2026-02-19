-- AlterTable
ALTER TABLE "AlumniProfile" ADD COLUMN     "avatarUrl" TEXT;

-- CreateTable
CREATE TABLE "AlumniImage" (
    "id" TEXT NOT NULL,
    "alumniProfileId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlumniImage_alumniProfileId_createdAt_idx" ON "AlumniImage"("alumniProfileId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "AlumniImage" ADD CONSTRAINT "AlumniImage_alumniProfileId_fkey" FOREIGN KEY ("alumniProfileId") REFERENCES "AlumniProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
