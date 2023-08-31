-- CreateTable
CREATE TABLE `follows` (
    `followerId` INTEGER NOT NULL,
    `followeeId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`followerId`, `followeeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_followeeId_fkey` FOREIGN KEY (`followeeId`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
