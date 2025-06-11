-- AlterTable
ALTER TABLE `Usuario` ADD COLUMN `codigoVerificacao` INTEGER NULL,
    ADD COLUMN `expiracaoCodigo` DATETIME(3) NULL;
