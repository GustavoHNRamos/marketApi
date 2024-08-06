import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

export const PostEntradaProduto = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "entradaProduto",
      "criar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { produtoId, quantidade, valor } = req.body;
    if (!produtoId || !quantidade || !valor) {
      return response(res, true, "Está faltando dados.");
    }

    const produtoExiste = await prisma.produtos.findFirst({
      where: { id: produtoId },
    });
    if (!produtoExiste) {
      res.status(404);
      return response(res, true, "Não existe um produto com este id.");
    }

    if (
      quantidade > produtoExiste.quantidade_max ||
      quantidade < produtoExiste.quantidade_min
    ) {
      res.status(400);
      return response(
        res,
        true,
        `Quantidade deve estar entre ${produtoExiste.quantidade_min} e ${produtoExiste.quantidade_max}.`
      );
    }

    if (valor !== produtoExiste.valor) {
      res.status(400);
      return response(res, true, `Valor deve ser ${produtoExiste.valor}.`);
    }

    const quantidadeAtualizada = quantidade + produtoExiste.quantidade;

    if (quantidadeAtualizada > produtoExiste.quantidade_max) {
      return response(
        res,
        true,
        "Quantidade total excedeu quantidade máxima",
        undefined,
        {
          quantidadeAtualizada,
          quantidadeMax: produtoExiste.quantidade_max,
        }
      );
    }

    const atualizarProduto = await prisma.produtos.update({
      where: { id: produtoId },
      data: {
        quantidade: quantidadeAtualizada,
      },
    });

    const salvarEntrada = await prisma.entrada_produto.create({
      data: {
        produtoId,
        quantidade,
        valor,
      },
    });

    const data = {
      entrada_produto: salvarEntrada,
      produto_atualizado: atualizarProduto,
    };

    return response(
      res,
      false,
      "Entrada do produto registrada com sucesso criado com sucesso.",
      undefined,
      data
    );
  } catch (err) {
    console.log(err);
    response(
      res,
      true,
      "Não foi possível registrar entrada do produto.",
      undefined,
      err
    );
    throw err;
  }
};

export const GetAllEntradas = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "entradaProduto",
      "listar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const listar = await prisma.entrada_produto.findMany();
    if (!listar.length) {
      res.status(404);
      return response(res, true, "Não existe nenhuma entrada registrada.");
    }

    return response(
      res,
      false,
      "Todas entradas encontradas.",
      listar.length,
      listar
    );
  } catch (err) {
    res.status(500);
    return response(res, true, "Erro ao listar entradas.", undefined, err);
  }
};

export const GetEntradaById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "entradaProduto",
      "listar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);
    const listarPorId = await prisma.entrada_produto.findFirst({
      where: { id },
    });
    if (!listarPorId) {
      res.status(404);
      return response(res, true, "Não existe entrada com este id.");
    }

    return response(
      res,
      false,
      "Entrada encontrada.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    response(res, true, "Não foi possível encontar entrada.", undefined, err);
    throw err;
  }
};

export const GetEntradaByProdutoId = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "entradaProduto",
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

    const listarPorProdutoId = await prisma.entrada_produto.findMany({
      where: { produtoId: id },
    });
    if (!listarPorProdutoId.length) {
      res.status(404);
      return response(res, true, "Não existe entrada para este produto.");
    }

    const data = {
      produto: produtoExiste,
      entradas: listarPorProdutoId,
    };

    return response(
      res,
      false,
      "Entradas encontrada.",
      listarPorProdutoId.length,
      data
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Entrada não encontrada.", undefined, err);
  }
};

// export const UpdateEntradaById = async function (req, res) {
//   try {
//     const permissao = await getTokenAndVerify(
//       req,
//       res,
//       "entradaProduto",
//       "atualizar"
//     );
//     if (!permissao) {
//       res.status(403);
//       return response(res, true, "Não possui permissão para aceder rota.");
//     }

//     const id = Number(req.params.id);
//     const { produtoId, quantidade, valor } = req.body;
//     if (!produtoId || !quantidade || !valor) {
//       return response(res, true, "Está faltando dados.");
//     }

//     const produtoExiste = await prisma.produtos.findFirst({
//       where: { id: produtoId },
//     });
//     if (!produtoExiste) {
//       res.status(404);
//       return response(res, true, "Não existe produto com este id.");
//     }

//     const entradaExiste = await prisma.entrada_produto.findFirst({
//       where: { id },
//     });
//     if (!entradaExiste) {
//       res.status(404);
//       return response(res, true, "Não existe entrada com este id.");
//     }

//     if (
//       quantidade > produtoExiste.quantidade_max ||
//       quantidade < produtoExiste.quantidade_min
//     ) {
//       res.status(400);
//       return response(
//         res,
//         true,
//         `Quantidade deve estar entre ${produtoExiste.quantidade_min} e ${produtoExiste.quantidade_max}.`
//       );
//     }

//     if (valor !== produtoExiste.valor) {
//       res.status(400);
//       return response(res, true, `Valor deve ser ${produtoExiste.valor}.`);
//     }

//     const entradaAtualizada = await prisma.entrada_produto.update({
//       where: {
//         id,
//       },
//       data: {
//         produtoId,
//         quantidade,
//         valor,
//       },
//     });

//     return response(
//       res,
//       false,
//       "Entrada atualizada com sucesso.",
//       undefined,
//       entradaAtualizada
//     );
//   } catch (err) {
//     console.log(err);
//     response(
//       res,
//       true,
//       "Não foi possível atualizar a entrada.",
//       undefined,
//       err
//     );
//   }
// };

export const DeleteEntradaById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "entradaProduto",
      "apagar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listar = await prisma.entrada_produto.findFirst({
      where: { id },
    });
    if (!listar) {
      return response(res, true, "Não existe entrada com este id.");
    }

    const apagar = await prisma.entrada_produto.delete({
      where: { id },
    });

    return response(res, false, "Entrada excluído com sucesso.", undefined, {
      id,
    });
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível excluir a entrada.",
      undefined,
      err
    );
  }
};
