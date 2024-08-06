// Crie as rotas da API CRUD (Create, Read, Update e Delete) nessa ordem.

// Utilize o Postman para testar a API

// Cria a modelagem de pastas e arquivos que achar melhor

import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Router } from "express";
import { Auth } from "./src/middleware/auth.js";

// Mercado
import {
  PostMercado,
  GetAllMercados,
  GetMercadoById,
  UpdateMercadoById,
  DeleteMercadoById,
} from "./src/controllers/MercadoController.js";
// Setor
import {
  PostSetor,
  GetAllSetores,
  GetSetorById,
  GetSetorByMercadoId,
  UpdateSetorById,
  DeleteSetorById,
} from "./src/controllers/SetorController.js";
// Funcionario
import {
  PostFuncionario,
  GetAllFuncionarios,
  GetFuncionarioById,
  GetFuncionarioBySetorId,
  UpdateFuncionarioById,
  DeleteFuncionarioById,
} from "./src/controllers/FuncionarioController.js";
// Vendas
import {
  PostVenda,
  GetAllVendas,
  GetVendaById,
  GetVendaByFuncionarioId,
  GetVendaByMercadoId,
  UpdateVendaById,
  DeleteVendaById,
} from "./src/controllers/VendasController.js";
// User
import {
  CreateUser,
  LoginUser,
  ForgotPassword,
  ResetPassword,
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById,
} from "./src/controllers/UserController.js";
// Estoque
import {
  PostEstoque,
  GetAllEstoques,
  GetEstoqueById,
  GetEstoqueByMercadoId,
  UpdateEstoqueById,
  DeleteEstoqueById,
} from "./src/controllers/EstoqueController.js";
// Produto
import {
  PostProduto,
  GetAllProdutos,
  GetProdutoById,
  GetProdutoByEstoqueId,
  UpdateProdutoById,
  DeleteProdutoById,
} from "./src/controllers/ProdutoController.js";
// EntradaProduto
import {
  PostEntradaProduto,
  GetAllEntradas,
  GetEntradaById,
  GetEntradaByProdutoId,
  // UpdateEntradaById,
  DeleteEntradaById,
} from "./src/controllers/EntradaController.js";
// SaidaProduto
import {
  PostSaidaProduto,
  GetAllSaidas,
  GetSaidaById,
  GetSaidaByProdutoId,
  // UpdateSaidaById,
  DeleteSaidaById,
} from "./src/controllers/SaidaController.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
const userRouter = Router();

userRouter.use(Auth);

// app.use((req, res, next) => {
//   console.log(req.cookies.accessToken);
//   if (!req.cookies.accessToken) {
//     res.status(401);
//     return response(
//       res,
//       true,
//       "Usuário não possui cookies necessários para aceder esta rota."
//     );
//   }
//   next();
// });

app.post("/user/register/", CreateUser);
app.post("/user/login/", LoginUser);
app.post("/user/forgot-password", ForgotPassword);
app.post("/user/reset-password/:token", ResetPassword);

userRouter.post("/mercado/", PostMercado);
userRouter.get("/mercado/", GetAllMercados);
userRouter.get("/mercado/:id", GetMercadoById);
userRouter.put("/mercado/:id", UpdateMercadoById);
userRouter.delete("/mercado/:id", DeleteMercadoById);

userRouter.post("/setor/", PostSetor);
userRouter.get("/setor/", GetAllSetores);
userRouter.get("/setor/:id", GetSetorById);
userRouter.get("/setor/mercado/:id", GetSetorByMercadoId);
userRouter.put("/setor/:id", UpdateSetorById);
userRouter.delete("/setor/:id", DeleteSetorById);

userRouter.post("/funcionario/", PostFuncionario);
userRouter.get("/funcionario/", GetAllFuncionarios);
userRouter.get("/funcionario/:id", GetFuncionarioById);
userRouter.get("/funcionario/setor/:id", GetFuncionarioBySetorId);
userRouter.put("/funcionario/:id", UpdateFuncionarioById);
userRouter.delete("/funcionario/:id", DeleteFuncionarioById);

userRouter.post("/venda/", PostVenda);
userRouter.get("/venda/", GetAllVendas);
userRouter.get("/venda/:id", GetVendaById);
userRouter.get("/venda/funcionario/:id", GetVendaByFuncionarioId);
userRouter.get("/venda/mercado/:id", GetVendaByMercadoId);
userRouter.put("/venda/:id", UpdateVendaById);
userRouter.delete("/venda/:id", DeleteVendaById);

userRouter.get("/user/", GetAllUsers);
userRouter.get("/user/:id", GetUserById);
userRouter.put("/user/:id", UpdateUserById);
userRouter.delete("/user/:id", DeleteUserById);

userRouter.post("/estoque/", PostEstoque);
userRouter.get("/estoque/", GetAllEstoques);
userRouter.get("/estoque/:id", GetEstoqueById);
userRouter.get("/estoque/mercado/:id", GetEstoqueByMercadoId);
userRouter.put("/estoque/:id", UpdateEstoqueById);
userRouter.delete("/estoque/:id", DeleteEstoqueById);

userRouter.post("/produto/", PostProduto);
userRouter.get("/produto/", GetAllProdutos);
userRouter.get("/produto/:id", GetProdutoById);
userRouter.get("/produto/estoque/:id", GetProdutoByEstoqueId);
userRouter.put("/produto/:id", UpdateProdutoById);
userRouter.delete("/produto/:id", DeleteProdutoById);

userRouter.post("/entrada/", PostEntradaProduto);
userRouter.get("/entrada/", GetAllEntradas);
userRouter.get("/entrada/:id", GetEntradaById);
userRouter.get("/entrada/produto/:id", GetEntradaByProdutoId);
// userRouter.put("/entrada/:id", UpdateEntradaById);
userRouter.delete("/entrada/:id", DeleteEntradaById);

userRouter.post("/saida/", PostSaidaProduto);
userRouter.get("/saida/", GetAllSaidas);
userRouter.get("/saida/:id", GetSaidaById);
userRouter.get("/saida/produto/:id", GetSaidaByProdutoId);
// userRouter.put("/saida/:id", UpdateSaidaById);
userRouter.delete("/saida/:id", DeleteSaidaById);

app.use("/", userRouter);

app.listen(3000, () => console.log("Server rodando na porta: 3000"));
