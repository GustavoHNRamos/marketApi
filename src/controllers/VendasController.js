import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

export const PostVenda = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "venda", "criar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const { id_funcionario, id_mercado, metodo_pagamento, produtos } = req.body;
    if (!id_funcionario || !id_mercado || !metodo_pagamento || !produtos) {
      return response(res, true, "Está faltando dados.");
    }

    const funcionarioExiste = await prisma.funcionarios.findFirst({
      where: { id: id_funcionario },
    });
    if (!funcionarioExiste) {
      return response(res, true, "Não existe funcionário com este id.");
    }

    const mercadoExiste = await prisma.mercados.findFirst({
      where: { id: id_mercado },
    });
    if (!mercadoExiste) {
      return response(res, true, "Não existe mercado com este id.");
    }

    const produtosConnect = [];
    for (const produto of produtos) {
      const produtoExiste = await prisma.produtos.findFirst({
        where: { id: produto.id },
      });
      if (!produtoExiste) {
        res.status(404);
        return response(res, true, "Não existe produto com este id.");
      }

      if (produto.quantidade > produtoExiste.quantidade) {
        return response(
          res,
          true,
          "Quantidade da venda excede a quantidade do produto."
        );
      }

      const quantAtualizado = produtoExiste.quantidade - produto.quantidade;
      const produtoAtualizado = await prisma.produtos.update({
        where: { id: produto.id },
        data: {
          quantidade: quantAtualizado,
        },
      });

      const valorTotal = produtoExiste.valor * produto.quantidade;
      produtosConnect.push({
        id: produto.id,
        nome: produtoExiste.nome,
        valor: produtoExiste.valor,
        quantidade: produto.quantidade,
        valorTotal,
      });

      const saidaProduto = await prisma.saida_produto.create({
        data: {
          produtoId: produto.id,
          quantidade: produto.quantidade,
          valor: valorTotal,
        },
      });
    }

    let valor = 0;
    produtosConnect.map(({ valorTotal }) => (valor += valorTotal));

    const salvarVenda = await prisma.vendas.create({
      data: {
        funcionarioId: id_funcionario,
        mercadoId: id_mercado,
        valor,
        metodoPagamento: metodo_pagamento,
        produtos: JSON.stringify(produtosConnect),
      },
    });

    return response(
      res,
      false,
      "Venda registrada com sucesso.",
      undefined,
      salvarVenda
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível registrar venda.",
      undefined,
      err
    );
  }
};

export const GetAllVendas = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "venda", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const listarVendas = await prisma.vendas.findMany();
    if (!listarVendas.length) {
      res.status(404);
      return response(res, true, "Não existe nenhuma venda registrada.");
    }

    return response(
      res,
      false,
      "Todas vendas encontradas.",
      listarVendas.length,
      listarVendas
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível listar vendas.",
      undefined,
      err
    );
  }
};

export const GetVendaById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "venda", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listarPorId = await prisma.vendas.findMany({
      where: { id },
    });
    if (!listarPorId.length) {
      return response(res, true, "Não existe venda com este id.");
    }

    return response(
      res,
      false,
      "Venda encontrada.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível listar venda.",
      undefined,
      err
    );
  }
};

export const GetVendaByFuncionarioId = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "venda", "listar");
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

    const listarPorFuncionarioId = await prisma.vendas.findMany({
      where: { funcionarioId: id },
    });
    if (!listarPorFuncionarioId.length) {
      return response(res, true, "Não existe vendas para este funcionário.");
    }

    return response(
      res,
      true,
      "Todas as vendas encontradas.",
      listarPorFuncionarioId.length,
      listarPorFuncionarioId
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível lsitar vendas.",
      undefined,
      err
    );
  }
};

export const GetVendaByMercadoId = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "venda", "listar");
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

    const listarPorFuncionarioId = await prisma.vendas.findMany({
      where: { mercadoId: id },
    });
    if (!listarPorFuncionarioId.length) {
      return response(res, true, "Não existe vendas neste mercado.");
    }

    return response(
      res,
      true,
      "Todas as vendas encontradas.",
      listarPorFuncionarioId.length,
      listarPorFuncionarioId
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível lsitar vendas.",
      undefined,
      err
    );
  }
};

export const UpdateVendaById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "venda", "atualizar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);
    const { id_funcionario, id_mercado, metodo_pagamento } = req.body;
    if (!id_funcionario || !id_mercado || !metodo_pagamento) {
      return response(res, true, "Está faltando dados.");
    }

    const vendaExiste = await prisma.vendas.findMany({
      where: { id },
    });
    if (!vendaExiste.length) {
      return response(res, true, "Não existe venda com este id.");
    }

    const funcionarioExiste = await prisma.funcionarios.findMany({
      where: { id: id_funcionario },
    });
    if (!funcionarioExiste.length) {
      return response(res, true, "Não existe funcionário com este id.");
    }

    const mercadoExiste = await prisma.mercados.findMany({
      where: { id: id_mercado },
    });
    if (!mercadoExiste.length) {
      return response(res, true, "Não existe mercado com este id.");
    }

    const vendaAtualizada = await prisma.vendas.update({
      where: { id },
      data: {
        funcionarioId: id_funcionario,
        mercadoId: id_mercado,
        metodoPagamento: metodo_pagamento,
      },
    });

    return response(
      res,
      false,
      "Venda atualizada com sucesso.",
      1,
      vendaAtualizada
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível atualizar venda.",
      undefined,
      err
    );
  }
};

export const DeleteVendaById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "venda", "apagar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const vendaExiste = await prisma.vendas.findMany({
      where: { id },
    });
    if (!vendaExiste.length) {
      return response(res, true, "Não existe venda com este id.");
    }

    const apagar = await prisma.vendas.delete({
      where: { id },
    });

    return response(res, false, "Venda excluída com sucesso.", undefined, {
      id,
    });
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível excluir venda.",
      undefined,
      err
    );
  }
};
