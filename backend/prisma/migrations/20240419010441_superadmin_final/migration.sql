/*
  Warnings:

  - You are about to drop the column `nombre` on the `empresa` table. All the data in the column will be lost.
  - Added the required column `nombre_empresa` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `empresa` DROP COLUMN `nombre`,
    ADD COLUMN `nombre_empresa` VARCHAR(191) NOT NULL;
