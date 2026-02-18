/*
  Warnings:

  - Made the column `userId` on table `cars` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cars` DROP FOREIGN KEY `cars_userId_fkey`;

-- AlterTable
ALTER TABLE `cars` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `cars` ADD CONSTRAINT `cars_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
