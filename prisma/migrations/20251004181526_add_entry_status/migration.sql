/*
Warnings:

- You are about to drop the column `completed` on the `Entry` table. All the data in the column will be lost.

 */
-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('todo', 'ignored', 'done');

-- AlterTable
-- First, add the new column with a default value
ALTER TABLE "Entry"
ADD COLUMN "status" "EntryStatus" NOT NULL DEFAULT 'todo';

-- Update the new column based on the old "completed" column
UPDATE "Entry"
SET
  "status" = 'done'
WHERE
  "completed" = true;

-- Now, drop the old column
ALTER TABLE "Entry"
DROP COLUMN "completed";