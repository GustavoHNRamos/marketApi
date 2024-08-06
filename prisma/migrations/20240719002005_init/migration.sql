-- CreateTable
CREATE TABLE "mercados" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "setores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mercadoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "setores_mercadoId_fkey" FOREIGN KEY ("mercadoId") REFERENCES "mercados" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setorId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "documento" TEXT NOT NULL,
    "salario" REAL NOT NULL,
    CONSTRAINT "funcionarios_setorId_fkey" FOREIGN KEY ("setorId") REFERENCES "setores" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vendas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mercadoId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "vendas_mercadoId_fkey" FOREIGN KEY ("mercadoId") REFERENCES "mercados" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vendas_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
