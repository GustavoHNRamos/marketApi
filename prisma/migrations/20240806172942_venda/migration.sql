/*
  Warnings:

  - You are about to drop the `_produtosTovendas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `produtos` to the `vendas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_produtosTovendas_B_index";

-- DropIndex
DROP INDEX "_produtosTovendas_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_produtosTovendas";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vendas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mercadoId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "produtos" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "vendas_mercadoId_fkey" FOREIGN KEY ("mercadoId") REFERENCES "mercados" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vendas_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_vendas" ("createdAt", "funcionarioId", "id", "mercadoId", "metodoPagamento", "updatedAt", "valor") SELECT "createdAt", "funcionarioId", "id", "mercadoId", "metodoPagamento", "updatedAt", "valor" FROM "vendas";
DROP TABLE "vendas";
ALTER TABLE "new_vendas" RENAME TO "vendas";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
