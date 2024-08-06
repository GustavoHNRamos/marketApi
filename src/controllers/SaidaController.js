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

    const listar = await prisma.mercados.findMany();
    if (!listar.length) {
      res.status(404);
      return response(res, true, "Não existe nenhum mercado criado");
    }

    return response(
      res,
      false,
      "Todos mercados encontrados.",
      listar.length,
      listar
    );
  } catch (err) {
    res.status(500);
    return response(res, true, "Erro", undefined, err);
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

    const listarPorId = await prisma.mercados.findMany({
      where: { id },
    });
    if (!listarPorId.length) {
      return response(res, true, "Não existe mercado com este id.");
    }

    return response(
      res,
      false,
      "Mercado encontrado.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível encontar mercado.",
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

    const setorExiste = await prisma.setores.findMany({
      where: { id },
    });
    if (!setorExiste.length) {
      return response(res, true, "Não existe setor com este id.");
    }

    const listarPorSetorId = await prisma.funcionarios.findMany({
      where: { setorId: id },
    });
    if (!listarPorSetorId.length) {
      res.status(400);
      return response(res, true, "Não existe funcionário nesse setor.");
    }

    return response(
      res,
      false,
      "Funcionário encontrado.",
      listarPorSetorId.length,
      listarPorSetorId
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Funcionário não encontrado.", undefined, err);
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

    const listar = await prisma.mercados.findMany({
      where: { id },
    });

    if (!listar.length) {
      return response(res, true, "Não existe mercado com este id.");
    }

    const apagar = await prisma.mercados.delete({
      where: { id },
    });

    return response(res, false, "Mercado excluído com sucesso.", undefined, {
      id,
    });
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível excluir o mercado.",
      undefined,
      err
    );
  }
};
