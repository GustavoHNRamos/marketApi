// @ts-nocheck

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import { responseAPI } from "App/Utils/responseApi";
import { prisma } from "../../../data";

export default class CategoriasController {
  public async criar({ request, response }: HttpContextContract) {
    try {
      const verificarLabelExistente: [{}] =
        await prisma.$queryRaw`SELECT * FROM categorias WHERE label = ${label}`;

      if (verificarLabelExistente.length) {
        response.status(400);
        return responseAPI(
          response,
          true,
          "Já existe uma categoria com esse label.",
          undefined,
          label
        );
      }

      const salvarCategoria = await prisma.categorias.create({
        data: {
          nome,
          frequencia,
          prioridade,
          label,
        },
      });

      return responseAPI(
        response,
        false,
        "Categoria criada com sucesso",
        undefined,
        salvarCategoria
      );
    } catch (err) {
      console.log(err);
      return responseAPI(
        response,
        true,
        "Não foi possível criar a categoria.",
        undefined,
        err
      );
    }
  }

  public async listar({ response }: HttpContextContract) {
    try {
      const listar: [{}] = await prisma.$queryRaw`SELECT * FROM categorias`;

      if (!listar.length) {
        response.status(404);
        return responseAPI(
          response,
          true,
          "Não existe nenhuma categoria criada."
        );
      }

      return responseAPI(
        response,
        false,
        "Todas as categorias encontradas!",
        listar.length,
        listar
      );
    } catch (error) {
      console.log(error);
      return responseAPI(response, true, "Mensagem erro.", undefined, error);
    }
  }

  public async atualizar({ request, response }: HttpContextContract) {
    try {
      const id = request.param("id");
      let label;
      if ("nome" in payload) {
        label = payload.nome?.replace(/\s/g, "_").toLowerCase();
      }
      const existeLabel =
        await prisma.$queryRaw`SELECT * FROM categorias WHERE label = ${label}`;

      if (existeLabel) {
        response.status(404);
        return responseAPI(
          response,
          true,
          "Já existe uma categoria com este label, tente novamente."
        );
      } else {
        payload.label = label;
      }

      await prisma.categorias.updateMany({
        where: { id: id },
        data: payload,
      });

      const categoriaAtualizada: {} =
        await prisma.$queryRaw`SELECT * FROM categorias WHERE id = ${id}`;

      return responseAPI(
        response,
        false,
        "Categoria atualizada com sucesso!",
        undefined,
        categoriaAtualizada[0]
      );
    } catch (error) {
      console.log(error);
      response.status(500);
      return responseAPI(response, true, "erro", undefined, error);
    }
  }

  public async deletar({ request, response }: HttpContextContract) {
    try {
      const id = request.param("id");

      const verificarCategoriaExistente: [{}] =
        await prisma.$queryRaw`SELECT * FROM categorias WHERE id = ${id}`;

      if (!verificarCategoriaExistente.length) {
        response.status(404);
        return responseAPI(
          response,
          true,
          "Não existe nenhuma categoria com este ID."
        );
      }

      const deletarCategoria =
        await prisma.$queryRaw`DELETE FROM categorias WHERE id = ${id}`;

      response.status(200);
      return responseAPI(
        response,
        false,
        "Categoria excluída com sucesso",
        undefined,
        id
      );
    } catch (err) {
      response.status(400);
      console.log(err);
      return responseAPI(
        response,
        true,
        "Não foi possível deletar esta categoria.",
        undefined,
        err
      );
    }
  }
}
