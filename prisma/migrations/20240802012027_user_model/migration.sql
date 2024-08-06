-- CreateTable
CREATE TABLE "estoque" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mercadoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    CONSTRAINT "estoque_mercadoId_fkey" FOREIGN KEY ("mercadoId") REFERENCES "mercados" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "estoqueId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "quantidade_min" INTEGER NOT NULL,
    "quantidade_max" INTEGER NOT NULL,
    CONSTRAINT "produtos_estoqueId_fkey" FOREIGN KEY ("estoqueId") REFERENCES "estoque" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "entrada_produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data_entrada" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" REAL NOT NULL,
    CONSTRAINT "entrada_produto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "saida_produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "data_saida" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" REAL NOT NULL,
    CONSTRAINT "saida_produto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_produtosTovendas" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_produtosTovendas_A_fkey" FOREIGN KEY ("A") REFERENCES "produtos" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_produtosTovendas_B_fkey" FOREIGN KEY ("B") REFERENCES "vendas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_produtosTovendas_AB_unique" ON "_produtosTovendas"("A", "B");

-- CreateIndex
CREATE INDEX "_produtosTovendas_B_index" ON "_produtosTovendas"("B");
