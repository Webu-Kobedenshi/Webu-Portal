-- CreateTable
CREATE TABLE "AlumniCompany" (
    "id" TEXT NOT NULL,
    "alumniProfileId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniCompany_pkey" PRIMARY KEY ("id")
);

-- Migrate existing single company values into AlumniCompany
INSERT INTO "AlumniCompany" ("id", "alumniProfileId", "companyName", "createdAt")
SELECT
    CONCAT('legacy_', "id") AS "id",
    "id" AS "alumniProfileId",
    "companyName",
    CURRENT_TIMESTAMP
FROM "AlumniProfile"
WHERE "companyName" IS NOT NULL;

-- DropIndex
DROP INDEX "AlumniProfile_companyName_idx";

-- AlterTable
ALTER TABLE "AlumniProfile" DROP COLUMN "companyName";

-- CreateIndex
CREATE UNIQUE INDEX "AlumniCompany_alumniProfileId_companyName_key" ON "AlumniCompany"("alumniProfileId", "companyName");

-- CreateIndex
CREATE INDEX "AlumniCompany_companyName_idx" ON "AlumniCompany"("companyName");

-- CreateIndex
CREATE INDEX "AlumniCompany_alumniProfileId_createdAt_idx" ON "AlumniCompany"("alumniProfileId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "AlumniCompany" ADD CONSTRAINT "AlumniCompany_alumniProfileId_fkey" FOREIGN KEY ("alumniProfileId") REFERENCES "AlumniProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
