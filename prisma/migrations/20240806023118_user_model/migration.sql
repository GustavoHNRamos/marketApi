-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estoqueId" INTEGER NOT NULL,
    "status" INTEGER,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "quantidade_min" INTEGER,
    "quantidade_max" INTEGER,
    CONSTRAINT "produtos_estoqueId_fkey" FOREIGN KEY ("estoqueId") REFERENCES "estoque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_produtos" ("estoqueId", "id", "nome", "quantidade", "quantidade_max", "quantidade_min", "status", "valor") SELECT "estoqueId", "id", "nome", "quantidade", "quantidade_max", "quantidade_min", "status", "valor" FROM "produtos";
DROP TABLE "produtos";
ALTER TABLE "new_produtos" RENAME TO "produtos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
