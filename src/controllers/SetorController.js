import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

export const PostSetor = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "setor", "criar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { id_mercado, nome, status } = req.body;
    if (!id_mercado || !nome || !status) {
      return response(res, true, "Está faltando dados.");
    }

    if (status === "0" || status === "1") {
      const setorExiste = await prisma.setores.findFirst({
        where: { nome },
      });
      if (setorExiste !== null) {
        res.status(400);
        return response(
          res,
          true,
          "Já existe um setor com este nome.",
          undefined,
          setorExiste
        );
      }

      const mercadoExiste = await prisma.mercados.findFirst({
        where: { id: id_mercado },
      });
      if (!mercadoExiste) {
        return response(res, true, "Não existe mercado com este id.");
      }

      const salvarMercado = await prisma.setores.create({
        data: {
          mercadoId: id_mercado,
          nome,
          status,
        },
      });

      return response(
        res,
        false,
        "Mercado criado com sucesso.",
        undefined,
        salvarMercado
      );
    } else {
      return response(res, true, "Status deve ser 0 ou 1");
    }
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível criar o setor.",
      undefined,
      err
    );
  }
};

export const GetAllSetores = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "setor", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const listarSetores = await prisma.setores.findMany();
    if (!listarSetores.length) {
      res.status(404);
      return response(res, true, "Não existe nenhum setor criado.");
    }

    return response(
      res,
      false,
      "Todos setores encontrados.",
      listarSetores.length,
      listarSetores
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível listar setores.",
      undefined,
      err
    );
  }
};

export const GetSetorById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "setor", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listarPorId = await prisma.setores.findMany({
      where: { id },
    });
    if (!listarPorId.length) {
      return response(res, true, "Não existe setor com este id.");
    }

    return response(
      res,
      false,
      "Setor encontrado.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Setor não encontrado", undefined, err);
  }
};

export const GetSetorByMercadoId = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "setor", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const mercadoExiste = await prisma.mercados.findMany({
      where: { id },
    });
    if (!mercadoExiste.length) {
      return response(res, true, "Não existe mercado com este id.");
    }

    const listarPorMercadoId = await prisma.setores.findMany({
      where: { mercadoId: id },
    });
    if (!listarPorMercadoId.length) {
      return response(res, true, "Não existe setor nesse mercado.");
    }

    return response(
      res,
      false,
      "Setor encontrado.",
      listarPorMercadoId.length,
      listarPorMercadoId
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Setor não encontrado", undefined, err);
  }
};

export const UpdateSetorById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "setor", "atualizar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { id_mercado, nome, status } = req.body;
    const id = Number(req.params.id);

    if (!id_mercado || !nome || !status) {
      return response(res, true, "Está faltando dados");
    }

    const setorExiste = await prisma.setores.findMany({
      where: { id },
    });
    if (!setorExiste.length) {
      return response(res, true, "Não existe setor com este id.");
    }

    const mercadoExiste = await prisma.mercados.findFirst({
      where: { id: id_mercado },
    });
    if (!mercadoExiste) {
      return response(res, true, "Não existe mercado com este id.");
    }

    const setorAtualizado = await prisma.setores.update({
      where: {
        id,
      },
      data: {
        mercadoId: id_mercado,
        nome,
        status,
      },
    });

    return response(
      res,
      false,
      "Setor atualizado com sucesso",
      undefined,
      setorAtualizado
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível atualizar o setor.",
      undefined,
      err
    );
  }
};

export const DeleteSetorById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "setor", "apagar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listar = await prisma.setores.findMany({
      where: { id },
    });
    if (!listar.length) {
      return response(res, true, "Não existe setor com este id.");
    }

    const apagar = await prisma.setores.delete({
      where: { id },
    });

    return response(res, false, "Setor excluído com sucesso.", undefined, {
      id,
    });
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível excluir o setor.",
      undefined,
      err
    );
  }
};
