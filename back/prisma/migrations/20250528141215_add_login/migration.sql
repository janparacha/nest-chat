/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- First add email column as nullable
ALTER TABLE "User" ADD COLUMN "email" TEXT;

-- Update existing users with a default email based on their username
UPDATE "User" SET "email" = username || '@example.com' WHERE "email" IS NULL;

-- Now make email non-nullable and unique
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");

-- Add password column
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL DEFAULT 'changeme';
