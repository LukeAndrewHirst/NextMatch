/*
  Warnings:

  - You are about to drop the column `passwordHas` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHas",
ADD COLUMN     "passwordHash" TEXT;
