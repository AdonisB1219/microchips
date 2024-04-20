/*
  Warnings:

  - The primary key for the `empresa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nombre` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `empresa` on the `user` table. All the data in the column will be lost.
  - Added the required column `id` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre_empresa` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `empresa` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_empresa_fkey`;

-- AlterTable
ALTER TABLE `empresa` DROP PRIMARY KEY,
    DROP COLUMN `nombre`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `nombre_empresa` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `empresa`,
    ADD COLUMN `empresaId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
