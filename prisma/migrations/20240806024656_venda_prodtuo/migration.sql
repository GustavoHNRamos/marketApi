/*
  Warnings:

  - You are about to drop the `_produtosTovendas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_produtosTovendas";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "venda_produto" (
    "vendaId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,

    PRIMARY KEY ("vendaId", "produtoId"),
    CONSTRAINT "venda_produto_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "vendas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "venda_produto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
