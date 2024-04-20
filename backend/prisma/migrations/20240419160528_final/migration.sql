/*
  Warnings:

  - Made the column `empresaId` on table `administradores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `empresaId` on table `veterinarios` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `administradores` DROP FOREIGN KEY `Administradores_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `veterinarios` DROP FOREIGN KEY `Veterinarios_empresaId_fkey`;

-- AlterTable
ALTER TABLE `administradores` MODIFY `empresaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `veterinarios` MODIFY `empresaId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Administradores` ADD CONSTRAINT `Administradores_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Veterinarios` ADD CONSTRAINT `Veterinarios_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
