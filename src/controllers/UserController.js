import jwt from "jsonwebtoken";
import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";
import { compareHashedPwd, hashPwd } from "../utils/hash.js";
import { getTokenAndVerify } from "../permissions/permissions.js";

const privateKey = process.env.JWT_SECRET;
const MINUTES = 10;

export const CreateUser = async function (req, res) {
  try {
    const { nome, email, senha, role } = req.body;
    if (!nome || !email || !senha || !role) {
      return response(res, true, "Está faltando dados.");
    }

    // if (role != "admin" || role !== "user") {
    //   return response(res, true, 'Role deve ser "admin" ou "user".');
    // }

    const userExiste = await prisma.users.findFirst({
      where: { email },
    });
    if (userExiste !== null) {
      return response(
        res,
        true,
        "Já existe usuário com este email.",
        undefined,
        userExiste
      );
    }

    const hashedPwd = await hashPwd(senha);

    const salvarUser = await prisma.users.create({
      data: {
        nome,
        email,
        senha: hashedPwd,
        role,
      },
    });

    return response(
      res,
      false,
      "Usuário registrado com sucesso.",
      undefined,
      salvarUser
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível registrar usuário.",
      undefined,
      err
    );
  }
};

export const LoginUser = async function (req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return response(res, true, "Está faltando dados.");
    }

    const userExiste = await prisma.users.findFirst({
      where: { email },
    });
    if (!userExiste) {
      res.status(400);
      return response(res, true, "Não existe usuário com este email.");
    }

    const match = compareHashedPwd(userExiste.senha, senha);
    if (match) {
      const signedToken = jwt.sign(userExiste, privateKey, {
        expiresIn: 36000,
      });

      // await res.cookie("accessToken", signedToken, {
      //   httpOnly: true,
      //   expires: new Date(Date.now() + 8 * 3600000),
      //   path: "/",
      // });

      return response(res, false, "Usuário redirecionado", undefined, {
        token: signedToken,
      });
    }
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível fazer login do usuário.",
      undefined,
      err
    );
  }
};

export const ForgotPassword = async function (req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return response(req, true, "Falta inserir email.");
    }

    const userExiste = await prisma.users.findFirst({
      where: { email },
    });
    if (!userExiste) {
      return response(res, true, "Não existe usuário com este email.");
    }

    const hash = await hashPwd(email);
    const updatedHash = hash.replace(/\//g, "");
    const date = new Date(Date.now() + MINUTES * 60000).toISOString();
    const atualizarUser = await prisma.users.update({
      where: { email },
      data: {
        resetToken: updatedHash,
        resetExp: date,
      },
    });

    const data = {
      resetPasswordToken: updatedHash,
      resetPasswordExpiracao: date,
      tokenExpiraEm: `${MINUTES} minutos.`,
      urlEnviadaAoEmail: `http://localhost:3000/user/reset-password/${updatedHash}`,
    };

    return response(
      res,
      false,
      "Token para repor senha gerado com sucesso.",
      undefined,
      data
    );
  } catch (err) {
    console.log(err);
    return response(res, true, "Algo deu errado, tente novamente.");
  }
};

export const ResetPassword = async function (req, res) {
  try {
    const token = req.params.token;
    const { senha } = req.body;
    if (!senha) {
      return response(res, true, "Falta inserir senha.");
    }

    const userExiste = await prisma.users.findFirst({
      where: { resetToken: token },
    });
    if (!userExiste) {
      return response(
        res,
        true,
        "Não foi possível encontrar usuário com este token."
      );
    }

    const date = new Date(Date.now()).toISOString();
    const expirar = new Date(userExiste.resetExp).toISOString();

    if (expirar > date) {
      const hash = await hashPwd(senha);
      const salvarSenha = await prisma.users.update({
        where: { email: userExiste.email },
        data: {
          senha: hash,
          resetToken: "",
          resetExp: date,
        },
      });

      return response(
        res,
        false,
        "Senha resetada com sucesso.",
        undefined,
        salvarSenha
      );
    } else {
      const data = {
        tokenExpirado: userExiste.resetExp > date ? true : false,
        expiracao: userExiste.resetExp,
        agora: date,
      };
      return response(
        res,
        true,
        "Token expirado. Tente novamente.",
        undefined,
        data
      );
    }
  } catch (err) {
    console.log(err);
    return response(res, true, "Não foi possível resetar a senha.");
  }
};

export const GetAllUsers = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "user", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const listarUsuarios = await prisma.users.findMany();
    if (!listarUsuarios.length) {
      res.status(404);
      return response(res, true, "Não existe nenhum usuário registrado.");
    }

    return response(
      res,
      false,
      "Todas usuários encontrados.",
      listarUsuarios.length,
      listarUsuarios
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível listar usuários.",
      undefined,
      err
    );
  }
};

export const GetUserById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "user", "listar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const listarPorId = await prisma.users.findMany({
      where: { id },
    });
    if (!listarPorId.length) {
      return response(res, true, "Não existe usuário com este id.");
    }

    return response(
      res,
      false,
      "Usuário encontrado.",
      listarPorId.length,
      listarPorId
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível listar usuário.",
      undefined,
      err
    );
  }
};

export const UpdateUserById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "user", "atualizar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);
    const { nome, email, senha, role } = req.body;
    if ((!nome || !email || !senha, role)) {
      return response(res, true, "Está faltando dados.");
    }

    const emailExiste = await prisma.users.findFirst({
      where: { email },
    });
    if (emailExiste) {
      return response(res, true, "Já existe um usuário com este email.");
    }

    const userExiste = await prisma.users.findMany({
      where: { id },
    });
    if (!userExiste.length) {
      return response(res, true, "Não existe usuário com este id.");
    }

    const hashedPwd = await hashPwd(senha);
    const userAtualizado = await prisma.users.update({
      where: { id },
      data: {
        nome,
        email,
        senha: hashedPwd,
        role,
      },
    });

    return response(
      res,
      false,
      "Usuário atualizado com sucesso.",
      1,
      userAtualizado
    );
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível atualizar usuário.",
      undefined,
      err
    );
  }
};

export const DeleteUserById = async function (req, res) {
  try {
    const permissao = await getTokenAndVerify(req, res, "user", "apagar");
    if (!permissao) {
      res.status(403);
      return response(res, true, "Não possui permissão para aceder rota.");
    }

    const id = Number(req.params.id);

    const userExiste = await prisma.users.findMany({
      where: { id },
    });
    if (!userExiste.length) {
      return response(res, true, "Não existe usuário com este id.");
    }

    const apagar = await prisma.users.delete({
      where: { id },
    });

    return response(res, false, "Usuário excluído com sucesso.", undefined, {
      id,
    });
  } catch (err) {
    console.log(err);
    return response(
      res,
      true,
      "Não foi possível excluir usuário.",
      undefined,
      err
    );
  }
};

// export const LogoutUser = async function (req, res) {
//   try {
//     const { accessToken } = req.cookies;
//     if (!accessToken) {
//       return response(res, true, 'O cookie "accessToken" não existe.');
//     }
//     res.clearCookie("accessToken", { path: "/" });
//     return response(res, false, "Logout realizado com sucesso.");
//   } catch (err) {
//     console.log(err);
//     return response(res, true, "Não foi possível fazer logout do usuário.");
//   }
// };
