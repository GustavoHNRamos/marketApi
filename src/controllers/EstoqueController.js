import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

export const PostEstoque = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "estoque", "criar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { mercadoId, nome, status } = req.body;
    if (!mercadoId || !nome || !status) {
      return response(res, true, "Está faltando dados.");
    }

    if (status === "0" || status === "1") {
      const mercadoExiste = await prisma.mercados.findFirst({
        where: { id: mercadoId },
      });
      if (!mercadoExiste) {
        res.status(404);
        return response(res, true, "Não existe um mercado com este id.");
      }

      const estoqueExisteEmMercado = await prisma.estoque.findFirst({
        where: {
          mercadoId,
          nome,
        },
      });
      if (estoqueExisteEmMercado) {
        res.status(400);
        return response(
          res,
          true,
          "Já existe um estoque com este nome neste mercado",
          undefined,
          estoqueExisteEmMercado
        );
      }

      const salvarEstoque = await prisma.estoque.create({
        data: {
          nome,
          status,
          mercadoId,
        },
      });

      return response(
        res,
        false,
        "Estoque criado com sucesso.",
        undefined,
        salvarEstoque
      );
    } else {
      return response(res, true, "Status deve ser 0 ou 1.");
    }
  } catch (err) {
    console.log(err);
    response(res, true, "Não foi possível criar o estoque.", undefined, err);
    throw err;
  }
};

export const GetAllEstoques = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "estoque", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const listar = await prisma.estoque.findMany();
    if (!listar.length) {
      res.status(404);
      return response(res, true, "Não existe nenhum estoque criado.");
    }

    return response(
      res,
      false,
      "Todos estoques encontrados.",
      listar.length,
      listar
    );
  } catch (err) {
    res.status(500);
    return response(res, true, "Erro ao listar estoque.", undefined, err);
  }
};

export const GetEstoqueById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "estoque", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);
    const listarPorId = await prisma.estoque.findFirst({
      where: { id },
    });
    if (!listarPorId) {
      res.status(404);
      return response(res, true, "Não existe estoque com este id.");
    }

    return response(
      res,
      false,
      "Estoque encontrado.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    response(res, true, "Não foi possível encontar estoque.", undefined, err);
    throw err;
  }
};

export const GetEstoqueByMercadoId = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "estoque", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const mercado = await prisma.mercados.findMany({
      where: { id },
    });
    if (!mercado.length) {
      return response(res, true, "Não existe mercado com este id.");
    }

    const listarPorMercadoId = await prisma.estoque.findMany({
      where: { mercadoId: id },
    });
    if (!listarPorMercadoId.length) {
      res.status(404);
      return response(res, true, "Não existe estoque nesse mercado.");
    }

    return response(
      res,
      false,
      "Estoque encontrado.",
      listarPorMercadoId.length,
      listarPorMercadoId
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Produto não encontrado.", undefined, err);
  }
};

export const UpdateEstoqueById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "estoque", "atualizar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);
    const { mercadoId, nome, status } = req.body;
    if (!mercadoId || !nome || !status) {
      res.status(400);
      return response(res, true, "Está faltando dados.");
    }

    const mercadoExiste = await prisma.mercados.findFirstOrThrow({
      where: { id: mercadoId },
    });
    if (!mercadoExiste) {
      res.status(404);
      return response(res, true, "Não existe mercado com este id.");
    }

    const estoqueExiste = await prisma.estoque.findFirstOrThrow({
      where: { id },
    });
    if (!estoqueExiste) {
      res.status(404);
      return response(res, true, "Não existe estoque com este id.");
    }

    const estoqueExisteEmMercado = await prisma.estoque.findFirst({
      where: {
        mercadoId,
        nome,
      },
    });
    if (estoqueExisteEmMercado) {
      res.status(400);
      return response(
        res,
        true,
        "Já existe um estoque com este nome neste mercado.",
        undefined,
        estoqueExisteEmMercado
      );
    }

    const estoqueAtualizado = await prisma.estoque.update({
      where: {
        id,
      },
      data: {
        mercadoId,
        nome,
        status,
      },
    });

    return response(
      res,
      false,
      "Estoque atualizado com sucesso.",
      undefined,
      estoqueAtualizado
    );
  } catch (err) {
    console.log(err);
    response(
      res,
      true,
      "Não foi possível atualizar o estoque.",
      undefined,
      err
    );
  }
};

export const DeleteEstoqueById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "estoque", "apagar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listar = await prisma.estoque.findFirst({
      where: { id },
    });
    if (!listar) {
      return response(res, true, "Não existe estoque com este id.");
    }

    const apagar = await prisma.estoque.delete({
      where: { id },
    });

    return response(res, false, "Estoque excluído com sucesso.", undefined, {
      id,
    });
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível excluir o estoque.",
      undefined,
      err
    );
  }
};
