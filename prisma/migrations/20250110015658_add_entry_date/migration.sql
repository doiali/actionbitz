ALTER TABLE "Entry" ADD COLUMN "date" DATE,
ALTER COLUMN "datetime" DROP NOT NULL,
ALTER COLUMN "datetime" DROP DEFAULT,
ALTER COLUMN "datetime" SET DATA TYPE TIMESTAMPTZ;
UPDATE "Entry" SET "date" = "datetime"::DATE;
UPDATE "Entry" SET "datetime" = NULL;
ALTER TABLE "Entry" ALTER COLUMN "date" SET NOT NULL;

