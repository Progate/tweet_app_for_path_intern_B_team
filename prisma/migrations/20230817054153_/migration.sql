/*
  Warnings:

  - You are about to drop the column `created_at` on the `follows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `follows` DROP COLUMN `created_at`,
    ADD COLUMN `followed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
