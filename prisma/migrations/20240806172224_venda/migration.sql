-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vendas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mercadoId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "valor" REAL,
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
