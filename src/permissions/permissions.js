import jwt from "jsonwebtoken";
import { prisma } from "../data/index.js";

const users = {
  admin: {
    mercado: ["criar", "listar", "atualizar", "apagar"],
    setor: ["criar", "listar", "atualizar", "apagar"],
    funcionario: ["criar", "listar", "atualizar", "apagar"],
    venda: ["criar", "listar", "atualizar", "apagar"],
    user: ["listar", "atualizar", "apagar"],
    estoque: ["criar", "listar", "atualizar", "apagar"],
    produto: ["criar", "listar", "atualizar", "apagar"],
    entradaProduto: ["criar", "listar", "apagar"],
    saidaProduto: ["criar", "listar", "apagar"],
  },
  chefe: {
    mercado: ["listar", "atualizar"],
    setor: ["criar", "listar", "atualizar", "apagar"],
    funcionario: ["criar", "listar", "atualizar", "apagar"],
    venda: ["criar", "listar", "atualizar", "apagar"],
    user: [],
    estoque: ["criar", "listar", "atualizar", "apagar"],
    produto: ["criar", "listar", "atualizar", "apagar"],
    entradaProduto: ["criar", "listar", "apagar"],
    saidaProduto: ["criar", "listar", "apagar"],
  },
  funcionario: {
    mercado: [],
    setor: ["listar"],
    funcionario: ["listar", "atualizar"],
    venda: ["criar", "listar", "atualizar"],
    user: [],
    estoque: ["criar", "listar", "atualizar", "apagar"],
    produto: ["criar", "listar", "atualizar", "apagar"],
    entradaProduto: ["criar", "listar", "apagar"],
    saidaProduto: ["criar", "listar", "apagar"],
  },
};

function verifyPermissions(role, route, action) {
  const rota = users[role][route];
  const acao = rota ? rota.find((rotas) => rotas === action) : false;

  if (!acao) {
    return false;
  }
  return true;
}

export const getTokenAndVerify = async (req, res, route, action) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    const isAuthenticated = jwt.decode(token);

    const userExiste = await prisma.users.findFirstOrThrow({
      where: { email: isAuthenticated?.email },
    });

    // verifyPermissions(userExiste.role, route, action, res);

    return verifyPermissions(userExiste.role, route, action, res);
  } catch (err) {
    throw err;
    // return;
  }
};
