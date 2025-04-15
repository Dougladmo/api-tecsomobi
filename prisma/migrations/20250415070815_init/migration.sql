-- CreateTable
CREATE TABLE "ChargingPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipoRecarga" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "horarioFuncionamento" TEXT NOT NULL,
    "responsavelNome" TEXT NOT NULL,
    "responsavelContato" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
