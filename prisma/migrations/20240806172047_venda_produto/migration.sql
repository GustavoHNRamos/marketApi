-- CreateTable
CREATE TABLE "_produtosTovendas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_produtosTovendas_A_fkey" FOREIGN KEY ("A") REFERENCES "produtos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_produtosTovendas_B_fkey" FOREIGN KEY ("B") REFERENCES "vendas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_venda_produto" (
    "vendaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    PRIMARY KEY ("vendaId", "produtoId")
);
INSERT INTO "new_venda_produto" ("produtoId", "vendaId") SELECT "produtoId", "vendaId" FROM "venda_produto";
DROP TABLE "venda_produto";
ALTER TABLE "new_venda_produto" RENAME TO "venda_produto";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_produtosTovendas_AB_unique" ON "_produtosTovendas"("A", "B");

-- CreateIndex
CREATE INDEX "_produtosTovendas_B_index" ON "_produtosTovendas"("B");
