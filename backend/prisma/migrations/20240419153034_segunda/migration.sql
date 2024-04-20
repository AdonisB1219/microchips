/*
  Warnings:

  - You are about to drop the column `direccion` on the `administradores` table. All the data in the column will be lost.
  - You are about to drop the column `aga` on the `veterinarios` table. All the data in the column will be lost.
  - Added the required column `identificacion` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `administradores` DROP COLUMN `direccion`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `identificacion` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `veterinarios` DROP COLUMN `aga`;

-- CreateTable
CREATE TABLE `SuperAdmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `observaciones` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `empresaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SuperAdmin` ADD CONSTRAINT `SuperAdmin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
