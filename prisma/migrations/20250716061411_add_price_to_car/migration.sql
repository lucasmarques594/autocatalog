/*
  Warnings:

  - Added the required column `price` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `car` ADD COLUMN `price` DOUBLE NOT NULL;
