-- CreateTable
CREATE TABLE `ShelfCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ShelfCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shelf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `size` ENUM('small', 'big') NOT NULL,
    `shelfCategoryId` INTEGER NOT NULL,

    INDEX `Shelf_shelfCategoryId_idx`(`shelfCategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `notes` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Company_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Status_itemId_idx`(`itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `placeId` INTEGER NOT NULL,
    `shelfId` INTEGER NULL,
    `shelfSize` VARCHAR(191) NULL,
    `itemTypeId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isOrder` BOOLEAN NOT NULL DEFAULT false,
    `orderCategoryId` INTEGER NULL,
    `parcelId` INTEGER NULL,

    INDEX `Item_shelfId_itemTypeId_companyId_orderCategoryId_parcelId_idx`(`shelfId`, `itemTypeId`, `companyId`, `orderCategoryId`, `parcelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parcel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,
    `isSent` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Parcel_companyId_idx`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ItemType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypeAttribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `itemtypeId` INTEGER NOT NULL,

    INDEX `TypeAttribute_itemtypeId_idx`(`itemtypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttributeValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `itemId` INTEGER NOT NULL,
    `typeAttributeId` INTEGER NOT NULL,

    INDEX `AttributeValue_itemId_typeAttributeId_idx`(`itemId`, `typeAttributeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
