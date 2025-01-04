/*
  Warnings:

  - Made the column `datetime` on table `Entry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "datetime" SET NOT NULL;
