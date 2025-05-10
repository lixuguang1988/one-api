/*用户表*/
CREATE TABLE `users` (
	`id` INT NOT NULL AUTO_INCREMENT COMMENT '主键',
	`email` VARCHAR(128) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`phone` VARCHAR(24) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`password` VARCHAR(256) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`username` VARCHAR(128) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`hire_date` DATE NULL DEFAULT NULL,
	`status` INT NULL DEFAULT 1 COMMENT '0 已删除 1正常 2已离职',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=3
;

-- 创建 departments 表
CREATE TABLE `departments` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`description` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`parent_id` INT NULL DEFAULT NULL,
	`status` INT NULL DEFAULT '1' COMMENT '0 已删除 1正常',
	`created_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `name` (`name`) USING BTREE,
	CONSTRAINT `FK_departments_departments` FOREIGN KEY (`parent_id`) REFERENCES `departments` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
/* 用户部门关系表 */
CREATE TABLE `user_departments` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`employee_id` INT NULL DEFAULT NULL,
	`department_id` INT NULL DEFAULT NULL,
	`created_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` INT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `employee_id` (`employee_id`) USING BTREE,
	INDEX `department_id` (`department_id`) USING BTREE,
	FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE,
	FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;


-- 创建 permissions 表
CREATE TABLE `permissions` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`menuName` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`menuCode` VARCHAR(255)  NOT NULL COLLATE 'utf8mb4_general_ci',
	`operation` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`created_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

-- 创建 roles 表
CREATE TABLE `roles` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`roleName` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`description` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`created_at` TIMESTAMP NULL DEFAULT (now()),
	`updated_at` TIMESTAMP NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`permission` JSON NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

/* 角色用户关系表 */
CREATE TABLE `role_users` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`role_id` INT NULL DEFAULT NULL,
	`user_id` INT NULL DEFAULT NULL,
	`created_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `role_id` (`role_id`) USING BTREE,
	INDEX `user_id` (`user_id`) USING BTREE,
	FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE,
	FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;