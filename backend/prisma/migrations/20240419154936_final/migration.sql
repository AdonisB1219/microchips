/*
  Warnings:

  - You are about to drop the column `empresaId` on the `superadmin` table. All the data in the column will be lost.
  - You are about to drop the column `rol` on the `user` table. All the data in the column will be lost.
  - Added the required column `rolId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_rol_fkey`;

-- AlterTable
ALTER TABLE `superadmin` DROP COLUMN `empresaId`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `rol`,
    ADD COLUMN `rolId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
