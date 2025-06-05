CREATE TABLE `pets` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`description` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`price` DECIMAL(10,2) NULL DEFAULT NULL,
	`pictures` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`color` INT NULL DEFAULT NULL COMMENT '颜色',
	`type` INT NULL DEFAULT NULL COMMENT '种类猫啊狗啊',
	`years` INT NULL DEFAULT NULL COMMENT '几岁几月',
	`vaccine` INT NULL DEFAULT NULL COMMENT '疫苗接种情况',
	`status` ENUM('active','inactive') NULL DEFAULT 'active' COLLATE 'utf8mb4_general_ci',
	`created_at` TIMESTAMP NULL DEFAULT (now()),
	`updated_at` TIMESTAMP NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`creater_id` INT NULL DEFAULT NULL,
	`updater_id` INT NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `color` (`color`) USING BTREE,
	INDEX `type` (`type`) USING BTREE,
	INDEX `years` (`years`) USING BTREE,
	INDEX `vaccine` (`vaccine`) USING BTREE,
	INDEX `FK_pets_users` (`creater_id`) USING BTREE,
	INDEX `FK_pets_users_2` (`updater_id`) USING BTREE,
	CONSTRAINT `FK_pets_users` FOREIGN KEY (`creater_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_pets_users_2` FOREIGN KEY (`updater_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`color`) REFERENCES `dicts` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `pets_ibfk_2` FOREIGN KEY (`type`) REFERENCES `dicts` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `pets_ibfk_3` FOREIGN KEY (`years`) REFERENCES `dicts` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `pets_ibfk_4` FOREIGN KEY (`vaccine`) REFERENCES `dicts` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

