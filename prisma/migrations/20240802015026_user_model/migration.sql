/*
  Warnings:

  - Added the required column `status` to the `estoque` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_estoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mercadoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    CONSTRAINT "estoque_mercadoId_fkey" FOREIGN KEY ("mercadoId") REFERENCES "mercados" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_estoque" ("id", "mercadoId", "nome") SELECT "id", "mercadoId", "nome" FROM "estoque";
DROP TABLE "estoque";
ALTER TABLE "new_estoque" RENAME TO "estoque";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
