import jwt from "jsonwebtoken";
import { response } from "../utils/response.js";
import { prisma } from "../data/index.js";

const privateKey = process.env.JWT_SECRET;

export const Auth = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return response(res, true, "Token não está presente.");
  }

  const isAuthenticated = jwt.verify(token, privateKey, (err) => {
    if (err) {
      console.log(err);
      res.status(401);
      return response(res, true, "Erro ao verificar token.", undefined, err);
    }
  });
  // const date = Math.floor(new Date().getTime() / 1000);

  const userExiste = await prisma.users.findFirst({
    where: { email: isAuthenticated?.email },
  });

  if (!userExiste) {
    return response(res, true, "Usuário não existe.");
  }

  next();
};
