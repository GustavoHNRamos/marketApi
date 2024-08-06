import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

export const PostMercado = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "mercado", "criar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { nome, endereco, status } = req.body;
    if (!nome || !endereco || !status) {
      return response(res, true, "Está faltando dados.");
    }

    if (status === "0" || status === "1") {
      const mercadoExiste = await prisma.mercados.findFirst({
        where: { nome },
      });
      if (mercadoExiste !== null) {
        res.status(400);
        return response(
          res,
          true,
          "Já existe um mercado com este nome.",
          undefined,
          mercadoExiste
        );
      }
      const salvarMercado = await prisma.mercados.create({
        data: {
          nome,
          endereco,
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
      return response(res, true, "Status deve ser 0 ou 1.");
    }
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível criar o mercado.",
      undefined,
      err
    );
  }
};

export const GetAllMercados = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "mercado", "listar");
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

export const GetMercadoById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "mercado", "listar");
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

export const UpdateMercadoById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "mercado", "atualizar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { nome, endereco, status } = req.body;
    const id = Number(req.params.id);

    if (!nome || !endereco || !status) {
      return response(res, true, "Está faltando dados");
    }

    const mercadoExiste = await prisma.mercados.findMany({
      where: { id },
    });

    if (!mercadoExiste.length) {
      return response(res, true, "Não existe mercado com este id.");
    }

    const mercadoAtualizado = await prisma.mercados.update({
      where: {
        id,
      },
      data: {
        nome,
        endereco,
        status,
      },
    });

    return response(
      res,
      false,
      "Mercado atualizado com sucesso",
      undefined,
      mercadoAtualizado
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível atualizar o mercado.",
      undefined,
      err
    );
  }
};

export const DeleteMercadoById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "mercado", "apagar");
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
