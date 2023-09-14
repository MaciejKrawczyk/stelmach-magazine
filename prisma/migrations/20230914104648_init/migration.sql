-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_orderCategoryId_fkey` FOREIGN KEY (`orderCategoryId`) REFERENCES `OrderCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
