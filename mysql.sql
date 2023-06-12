CREATE DATABASE db_login_registro;

CREATE TABLE `db_login_registro`.`usuarios` (
    `idusuarios` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(30) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `alterpassword` VARCHAR(200),
    `img` VARCHAR(50),
    PRIMARY KEY (`idusuarios`)
);
