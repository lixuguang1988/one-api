CREATE TABLE `dicts` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_general_ci',
	`code` VARCHAR(50) NULL DEFAULT NULL COMMENT '分类编码（可选）' COLLATE 'utf8mb4_general_ci',
	`parent_id` INT NULL DEFAULT NULL COMMENT '父级分类ID，NULL为根节点',
	`description` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `parent_id` (`parent_id`) USING BTREE,
	CONSTRAINT `dicts_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `dicts` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
