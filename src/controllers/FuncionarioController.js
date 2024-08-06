// const sqlite3 = require("sqlite3").verbose();
// const db = new sqlite3.Database("market.db");
import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

export const PostFuncionario = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "funcionario", "criar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { id_setor, nome, idade, documento, salario } = req.body;
    if (!id_setor || !nome || !idade || !documento || !salario) {
      return response(res, true, "Está faltando dados.");
    }

    const setorExiste = await prisma.setores.findFirst({
      where: { id: id_setor },
    });
    if (!setorExiste) {
      return response(res, true, "Não existe setor com este id.");
    }

    const funcionarioExiste = await prisma.funcionarios.findFirst({
      where: { nome },
    });
    if (funcionarioExiste !== null) {
      return response(
        res,
        true,
        "Já existe um funcionário com este nome.",
        undefined,
        funcionarioExiste
      );
    }

    const salvarFuncionario = await prisma.funcionarios.create({
      data: {
        setorId: id_setor,
        nome,
        idade,
        documento,
        salario,
      },
    });

    return response(
      res,
      false,
      "Funcionário criado com sucesso.",
      undefined,
      salvarFuncionario
    );
  } catch (err) {
    console.log(err);
    response(res, true, "Erro ao criar funcionário", undefined, err);
  }
};

export const GetAllFuncionarios = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "funcionario",
      "listar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const listarFuncionarios = await prisma.funcionarios.findMany();
    if (!listarFuncionarios.length) {
      res.status(400);
      return response(res, true, "Não existe nenhum funcionário criado.");
    }

    return response(
      res,
      false,
      "Todos funcionário criados.",
      listarFuncionarios.length,
      listarFuncionarios
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Não foi possível listar funcionários.");
  }
};

export const GetFuncionarioById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "funcionario",
      "listar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listarPorId = await prisma.funcionarios.findMany({
      where: { id },
    });
    if (!listarPorId.length) {
      res.status(400);
      return response(res, true, "Não existe funcionário com este id.");
    }

    return response(
      res,
      false,
      "Funcionário encontrado.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Funcionário não encontrado.", undefined, err);
  }
};

export const GetFuncionarioBySetorId = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "funcionario",
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

export const UpdateFuncionarioById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "funcionario",
      "atualizar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { id_setor, nome, idade, documento, salario } = req.body;
    const id = Number(req.params.id);
    if (!id_setor || !nome || !idade || !documento || !salario) {
      return response(res, true, "Está faltando dados.");
    }

    const funcionarioExiste = await prisma.funcionarios.findMany({
      where: { id },
    });
    if (!funcionarioExiste.length) {
      return response(res, true, "Não existe funcionário com este id.");
    }

    const setorExiste = await prisma.setores.findFirst({
      where: { id: id_setor },
    });
    if (!setorExiste) {
      return response(res, true, "Não existe setor com este id.");
    }

    const funcionarioAtualizado = await prisma.funcionarios.update({
      where: { id },
      data: {
        setorId: id_setor,
        nome,
        idade,
        documento,
        salario,
      },
    });

    return response(
      res,
      false,
      "Funcionário atualizado com sucesso.",
      undefined,
      funcionarioAtualizado
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível atualizar funcionário.",
      undefined,
      err
    );
  }
};

export const DeleteFuncionarioById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(
      req,
      res,
      "funcionario",
      "apagar"
    );
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const funcionarioExiste = await prisma.funcionarios.findMany({
      where: { id },
    });
    if (!funcionarioExiste.length) {
      return response(res, true, "Não existe funcionário com este id.");
    }

    const apagar = await prisma.funcionarios.delete({
      where: { id },
    });

    return response(
      res,
      false,
      "Funcionário exlcuído com sucesso.",
      undefined,
      {
        id,
      }
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível excluir funcionário,",
      undefined,
      err
    );
  }
};
