/*
  Warnings:

  - You are about to drop the column `shelfId` on the `category` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Category_shelfId_key` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `shelfId`;

-- CreateTable
CREATE TABLE `Shelf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `size` ENUM('small', 'big') NOT NULL,
    `categoryId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shelf` ADD CONSTRAINT `Shelf_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
