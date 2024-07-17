/*
  Warnings:

  - Added the required column `email` to the `otps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "otps" ADD COLUMN     "email" TEXT NOT NULL;
