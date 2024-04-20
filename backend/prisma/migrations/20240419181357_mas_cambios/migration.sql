/*
  Warnings:

  - You are about to drop the column `responsableId` on the `mascota` table. All the data in the column will be lost.
  - You are about to drop the column `empresaId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `es_admin` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `es_superadmin` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `es_tutor` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `es_veterinario` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `responsable` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rolId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `mascota` DROP FOREIGN KEY `Mascota_responsableId_fkey`;

-- DropForeignKey
ALTER TABLE `responsable` DROP FOREIGN KEY `Responsable_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_empresaId_fkey`;

-- AlterTable
ALTER TABLE `mascota` DROP COLUMN `responsableId`,
    ADD COLUMN `veterinarioId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `empresaId`,
    DROP COLUMN `es_admin`,
    DROP COLUMN `es_superadmin`,
    DROP COLUMN `es_tutor`,
    DROP COLUMN `es_veterinario`,
    ADD COLUMN `rolId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `responsable`;

-- CreateTable
CREATE TABLE `Veterinario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_registro` VARCHAR(191) NOT NULL,
    `especialidad` VARCHAR(191) NULL,
    `aga` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administradores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Observaciones` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SuperAdministrador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mascota` ADD CONSTRAINT `Mascota_veterinarioId_fkey` FOREIGN KEY (`veterinarioId`) REFERENCES `Veterinario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Veterinario` ADD CONSTRAINT `Veterinario_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Veterinario` ADD CONSTRAINT `Veterinario_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administradores` ADD CONSTRAINT `Administradores_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administradores` ADD CONSTRAINT `Administradores_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SuperAdministrador` ADD CONSTRAINT `SuperAdministrador_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
