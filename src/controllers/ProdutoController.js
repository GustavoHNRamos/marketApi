import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

export const PostProduto = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "produto", "criar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const {
      estoqueId,
      status,
      nome,
      valor,
      quantidade,
      quantidade_min,
      quantidade_max,
    } = req.body;
    if (
      !estoqueId ||
      !status ||
      !nome ||
      !valor ||
      !quantidade ||
      !quantidade_min ||
      !quantidade_max
    ) {
      return response(res, true, "Está faltando dados.");
    }

    if (status === 0 || status === 1) {
      const estoqueExiste = await prisma.estoque.findFirst({
        where: { id: estoqueId },
      });
      if (!estoqueExiste) {
        res.status(404);
        return response(res, true, "Não existe um estoque com este id.");
      }

      const produtoExisteEmEstoque = await prisma.produtos.findFirst({
        where: {
          estoqueId,
          nome,
        },
      });
      if (produtoExisteEmEstoque) {
        res.status(400);
        return response(
          res,
          true,
          "Já existe um produto com este nome neste estoque.",
          undefined,
          produtoExisteEmEstoque
        );
      }
      if (quantidade > quantidade_max || quantidade < quantidade_min) {
        res.status(400);
        return response(
          res,
          true,
          `Quantidade deve estar entre ${quantidade_min} e ${quantidade_max}.`
        );
      }

      const salvarEstoque = await prisma.produtos.create({
        data: {
          estoqueId,
          status,
          nome,
          valor,
          quantidade,
          quantidade_min,
          quantidade_max,
        },
      });

      return response(
        res,
        false,
        "Produto criado com sucesso.",
        undefined,
        salvarEstoque
      );
    } else {
      return response(res, true, "Status deve ser 0 ou 1.");
    }
  } catch (err) {
    console.log(err);
    response(res, true, "Não foi possível criar o produto.", undefined, err);
    throw err;
  }
};

export const GetAllProdutos = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "produto", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const listar = await prisma.produtos.findMany();
    if (!listar.length) {
      res.status(404);
      return response(res, true, "Não existe nenhum produto criado.");
    }

    return response(
      res,
      false,
      "Todos produto encontrados.",
      listar.length,
      listar
    );
  } catch (err) {
    res.status(500);
    return response(res, true, "Erro ao listar produto.", undefined, err);
  }
};

export const GetProdutoById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "produto", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);
    const listarPorId = await prisma.produtos.findFirst({
      where: { id },
    });
    if (!listarPorId) {
      res.status(404);
      return response(res, true, "Não existe produto com este id.");
    }

    return response(
      res,
      false,
      "Produto encontrado.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    response(res, true, "Não foi possível encontar produto.", undefined, err);
    throw err;
  }
};

export const GetProdutoByEstoqueId = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "produto", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const estoque = await prisma.estoque.findMany({
      where: { id },
    });
    if (!estoque.length) {
      return response(res, true, "Não existe estoque com este id.");
    }

    const listarPorEstoqueId = await prisma.produtos.findMany({
      where: { estoqueId: id },
    });
    if (!listarPorEstoqueId.length) {
      res.status(404);
      return response(res, true, "Não existe produto nesse mercado.");
    }

    return response(
      res,
      false,
      "Produtos encontrado.",
      listarPorEstoqueId.length,
      listarPorEstoqueId
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Produto não encontrado.", undefined, err);
  }
};

export const UpdateProdutoById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "produto", "atualizar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);
    const {
      estoqueId,
      status,
      nome,
      valor,
      quantidade,
      quantidade_min,
      quantidade_max,
    } = req.body;
    if (
      !estoqueId ||
      !status ||
      !nome ||
      !valor ||
      !quantidade ||
      !quantidade_min ||
      !quantidade_max
    ) {
      return response(res, true, "Está faltando dados.");
    }

    if (status === 0 || status === 1) {
      const estoqueExiste = await prisma.estoque.findFirst({
        where: { id: estoqueId },
      });
      if (!estoqueExiste) {
        res.status(404);
        return response(res, true, "Não existe estoque com este id.");
      }

      const produtoExiste = await prisma.produtos.findFirst({
        where: { id },
      });
      if (!produtoExiste) {
        res.status(404);
        return response(res, true, "Não existe produto com este id.");
      }

      // const produtoExisteEmMercado = await prisma.produtos.findFirst({
      //   where: {
      //     estoqueId,
      //     nome,
      //   },
      // });
      // if (produtoExisteEmMercado) {
      //   res.status(400);
      //   return response(
      //     res,
      //     true,
      //     "Já existe um produto com este nome neste estoque.",
      //     undefined,
      //     produtoExisteEmMercado
      //   );
      // }

      if (quantidade > quantidade_max || quantidade < quantidade_min) {
        res.status(400);
        return response(
          res,
          true,
          `Quantidade deve estar entre ${quantidade_min} e ${quantidade_max}.`
        );
      }

      const produtoAtualizado = await prisma.produtos.update({
        where: {
          id,
        },
        data: {
          estoqueId,
          status,
          nome,
          valor,
          quantidade,
          quantidade_min,
          quantidade_max,
        },
      });

      return response(
        res,
        false,
        "Produto atualizado com sucesso.",
        undefined,
        produtoAtualizado
      );
    } else {
      return response(res, true, "Status deve ser 0 ou 1.");
    }
  } catch (err) {
    console.log(err);
    response(
      res,
      true,
      "Não foi possível atualizar o produto.",
      undefined,
      err
    );
  }
};

export const DeleteProdutoById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "produto", "apagar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listar = await prisma.produtos.findFirst({
      where: { id },
    });
    if (!listar) {
      return response(res, true, "Não existe produto com este id.");
    }

    const apagar = await prisma.produtos.delete({
      where: { id },
    });

    return response(res, false, "Produto excluído com sucesso.", undefined, {
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
