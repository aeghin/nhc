-- CreateTable
CREATE TABLE "EventTemplateDay" (
    "id" TEXT NOT NULL,
    "dayOffset" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "EventTemplateDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventTemplateDay_templateId_idx" ON "EventTemplateDay"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTemplateDay_templateId_dayOffset_key" ON "EventTemplateDay"("templateId", "dayOffset");

-- AddForeignKey
ALTER TABLE "EventTemplateDay" ADD CONSTRAINT "EventTemplateDay_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EventTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve existing templates: copy each one's times into a day-0 row before dropping the columns
INSERT INTO "EventTemplateDay" ("id", "dayOffset", "startTime", "endTime", "templateId")
SELECT gen_random_uuid(), 0, "startTime", "endTime", "id" FROM "EventTemplate";

-- AlterTable
ALTER TABLE "EventTemplate" DROP COLUMN "endTime",
DROP COLUMN "startTime";
