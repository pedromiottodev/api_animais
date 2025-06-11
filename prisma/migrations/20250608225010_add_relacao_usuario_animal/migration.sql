/*
  Warnings:

  - Added the required column `id_usuario` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Animal` ADD COLUMN `id_usuario` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Animal` ADD CONSTRAINT `Animal_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
