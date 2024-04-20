-- CreateTable
CREATE TABLE `Mascota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_mascota` VARCHAR(191) NOT NULL,
    `codigo_chip` VARCHAR(191) NOT NULL,
    `lugar_implantacion` VARCHAR(191) NOT NULL,
    `fecha_implantacion` DATETIME(3) NOT NULL,
    `fecha_nacimiento` DATETIME(3) NOT NULL,
    `especie` ENUM('CANINO', 'FELINO') NOT NULL,
    `raza` VARCHAR(191) NOT NULL,
    `sexo` ENUM('MACHO', 'HEMBRA') NOT NULL,
    `ubicacion` VARCHAR(191) NOT NULL,
    `aga` VARCHAR(191) NULL,
    `esterilizado` ENUM('SI', 'NO') NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `tutorId` INTEGER NOT NULL,
    `veterinarioId` INTEGER NOT NULL,

    UNIQUE INDEX `Mascota_codigo_chip_key`(`codigo_chip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `identificacion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `rolId` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tutor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `observaciones` VARCHAR(191) NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Veterinario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_registro` VARCHAR(191) NOT NULL,
    `especialidad` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_empresa` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mascota` ADD CONSTRAINT `Mascota_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mascota` ADD CONSTRAINT `Mascota_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `Tutor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mascota` ADD CONSTRAINT `Mascota_veterinarioId_fkey` FOREIGN KEY (`veterinarioId`) REFERENCES `Veterinario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tutor` ADD CONSTRAINT `Tutor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Veterinario` ADD CONSTRAINT `Veterinario_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
