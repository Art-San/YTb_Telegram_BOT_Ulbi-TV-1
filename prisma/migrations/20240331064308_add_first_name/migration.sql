/*
  Warnings:

  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "first_name" TEXT NOT NULL;
