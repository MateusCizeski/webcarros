/*
  Warnings:

  - You are about to drop the column `uid` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `CarImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "uid";

-- AlterTable
ALTER TABLE "CarImage" DROP COLUMN "uid";
