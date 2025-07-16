-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'STORE', 'SELLER', 'INDIVIDUAL_SELLER', 'BUYER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `cnpj` VARCHAR(191) NULL,

    UNIQUE INDEX `Profile_userId_key`(`userId`),
    UNIQUE INDEX `Profile_cpf_key`(`cpf`),
    UNIQUE INDEX `Profile_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `Store_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seller` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Seller_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `mileage` INTEGER NOT NULL,
    `fuelType` ENUM('GASOLINE', 'ETHANOL', 'FLEX', 'DIESEL', 'ELECTRIC', 'HYBRID') NOT NULL,
    `transmission` ENUM('MANUAL', 'AUTOMATIC') NOT NULL,
    `doors` INTEGER NOT NULL,
    `plateStart` VARCHAR(191) NOT NULL,
    `engine` VARCHAR(191) NOT NULL,
    `enginePower` VARCHAR(191) NOT NULL,
    `airConditioning` BOOLEAN NOT NULL,
    `direction` ENUM('MECHANICAL', 'HYDRAULIC', 'ELECTRIC') NOT NULL,
    `electricWindows` BOOLEAN NOT NULL,
    `leatherSeats` BOOLEAN NOT NULL,
    `mediaCenter` BOOLEAN NOT NULL,
    `reverseCamera` BOOLEAN NOT NULL,
    `parkingSensor` BOOLEAN NOT NULL,
    `airbags` INTEGER NOT NULL,
    `absBrakes` BOOLEAN NOT NULL,
    `wheels` VARCHAR(191) NOT NULL,
    `tires` VARCHAR(191) NOT NULL,
    `suspension` VARCHAR(191) NOT NULL,
    `paintCondition` VARCHAR(191) NOT NULL,
    `ownerManual` BOOLEAN NOT NULL,
    `backupKey` BOOLEAN NOT NULL,
    `licensingUpToDate` BOOLEAN NOT NULL,
    `ownersCount` INTEGER NOT NULL,
    `collisionHistory` VARCHAR(191) NOT NULL,
    `documentSituation` VARCHAR(191) NOT NULL,
    `driveType` ENUM('FWD', 'RWD', 'AWD', 'FOUR_BY_FOUR') NOT NULL,
    `alarm` BOOLEAN NOT NULL,
    `roof` ENUM('NONE', 'SUNROOF', 'PANORAMIC') NOT NULL,
    `images` JSON NOT NULL,
    `status` ENUM('AVAILABLE', 'SOLD') NOT NULL DEFAULT 'AVAILABLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seller` ADD CONSTRAINT `Seller_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seller` ADD CONSTRAINT `Seller_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
