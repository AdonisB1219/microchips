/*
  Warnings:

  - The primary key for the `empresa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_empresa` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `empresaId` on the `user` table. All the data in the column will be lost.
  - Added the required column `nombre` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_empresaId_fkey`;

-- AlterTable
ALTER TABLE `empresa` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `nombre_empresa`,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `telefono` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`nombre`);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `empresaId`,
    ADD COLUMN `empresa` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_empresa_fkey` FOREIGN KEY (`empresa`) REFERENCES `Empresa`(`nombre`) ON DELETE SET NULL ON UPDATE CASCADE;
