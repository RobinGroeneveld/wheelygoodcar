/*
  Warnings:

  - You are about to drop the column `brand` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `cars` table. All the data in the column will be lost.
  - Added the required column `license_plate` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `make` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cars` DROP COLUMN `brand`,
    DROP COLUMN `title`,
    ADD COLUMN `color` VARCHAR(100) NULL,
    ADD COLUMN `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `doors` INTEGER NULL,
    ADD COLUMN `image` VARCHAR(500) NULL,
    ADD COLUMN `license_plate` VARCHAR(20) NOT NULL,
    ADD COLUMN `make` VARCHAR(255) NOT NULL,
    ADD COLUMN `model` VARCHAR(255) NOT NULL,
    ADD COLUMN `production_year` INTEGER NULL,
    ADD COLUMN `seats` INTEGER NULL,
    ADD COLUMN `sold_at` TIMESTAMP(6) NULL,
    ADD COLUMN `updated_at` TIMESTAMP(6) NOT NULL,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `weight` INTEGER NULL;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `phone_number` VARCHAR(20) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `color` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_tag` (
    `tag_id` INTEGER NOT NULL,
    `car_id` INTEGER NOT NULL,

    INDEX `car_tag_tag_id_idx`(`tag_id`),
    PRIMARY KEY (`car_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `car_tag` ADD CONSTRAINT `car_tag_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_tag` ADD CONSTRAINT `car_tag_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
