import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

export const PostSaidaProduto = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "saidaProduto",
      "criar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { produtoId, quantidade } = req.body;
    if (!produtoId || !quantidade) {
      return response(res, true, "Está faltando dados.");
    }

    const produtoExiste = await prisma.produtos.findFirst({
      where: { id: produtoId },
    });
    if (!produtoExiste) {
      res.status(400);
      return response(res, true, "Não existe um produto com este nome.");
    }

    if (quantidade > produtoExiste.quantidade) {
      return response(
        res,
        true,
        "Quantidade da venda excede a quantidade do produto."
      );
    }

    const quantAtualizado = produtoExiste.quantidade - quantidade;
    const produtoAtualizado = await prisma.produtos.update({
      where: { id: produtoId },
      data: {
        quantidade: quantAtualizado,
      },
    });

    const valorTotal = produtoExiste.valor * quantidade;

    const salvarSaida = await prisma.saida_produto.create({
      data: {
        produtoId,
        quantidade: quantidade,
        valor: valorTotal,
      },
    });

    const data = {
      saida_produto: salvarSaida,
      produto_atualizado: produtoAtualizado,
    };

    return response(
      res,
      false,
      "Saida de produto registrado com sucesso.",
      undefined,
      data
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível registrar a saida.",
      undefined,
      err
    );
  }
};

export const GetAllSaidas = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "saidaProduto",
      "listar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const listar = await prisma.saida_produto.findMany();
    if (!listar.length) {
      res.status(404);
      return response(res, true, "Não existe nenhuma saída criada");
    }

    return response(
      res,
      false,
      "Todas saídas encontrados.",
      listar.length,
      listar
    );
  } catch (err) {
    res.status(500);
    return response(
      res,
      true,
      "Não foi possível listar as saídas",
      undefined,
      err
    );
  }
};

export const GetSaidaById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "saidaProduto",
      "listar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listarPorId = await prisma.saida_produto.findMany({
      where: { id },
    });
    if (!listarPorId.length) {
      return response(res, true, "Não existe saída registrada com este id.");
    }

    return response(
      res,
      false,
      "Saída encontrada.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível encontar saída.",
      undefined,
      err
    );
  }
};

export const GetSaidaByProdutoId = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "saidaProduto",
      "listar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const produtoExiste = await prisma.produtos.findMany({
      where: { id },
    });
    if (!produtoExiste.length) {
      return response(res, true, "Não existe produto com este id.");
    }

    const listarPorProdutoId = await prisma.saida_produto.findMany({
      where: { produtoId: id },
    });
    if (!listarPorProdutoId.length) {
      res.status(400);
      return response(res, true, "Não existe saída para este produto.");
    }

    const data = {
      produto: produtoExiste,
      saidas: listarPorProdutoId,
    };

    return response(
      res,
      false,
      "Saídas encontradas.",
      listarPorProdutoId.length,
      data
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível encontrar saídas.",
      undefined,
      err
    );
  }
};

// export const UpdateSaidaById = async function (req, res) {
//   try {
//     const permissao = await getTokenAndVerify(req, res, "saidaProduto", "atualizar");
//     if (!permissao) {
//       res.status(403);
//       return response(res, true, "Não possui permissão para aceder rota.");
//     }

//     const { nome, endereco, status } = req.body;
//     const id = Number(req.params.id);

//     if (!nome || !endereco || !status) {
//       return response(res, true, "Está faltando dados");
//     }

//     const mercadoExiste = await prisma.mercados.findMany({
//       where: { id },
//     });

//     if (!mercadoExiste.length) {
//       return response(res, true, "Não existe mercado com este id.");
//     }

//     const mercadoAtualizado = await prisma.mercados.update({
//       where: {
//         id,
//       },
//       data: {
//         nome,
//         endereco,
//         status,
//       },
//     });

//     return response(
//       res,
//       false,
//       "Mercado atualizado com sucesso",
//       undefined,
//       mercadoAtualizado
//     );
//   } catch (err) {
//     console.log(err);
//     return response(
//       res,
//       true,
//       "Não foi possível atualizar o mercado.",
//       undefined,
//       err
//     );
//   }
// };

export const DeleteSaidaById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "saidaProduto",
      "apagar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listar = await prisma.saida_produto.findFirst({
      where: { id },
    });
    if (!listar) {
      return response(res, true, "Não existe saída com este id.");
    }

    const apagar = await prisma.saida_produto.delete({
      where: { id },
    });

    return response(res, false, "Saída excluído com sucesso.", undefined, {
      id,
    });
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível excluir a saída.",
      undefined,
      err
    );
  }
};
