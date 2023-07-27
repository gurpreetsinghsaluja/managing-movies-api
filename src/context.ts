import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import { verifyJWT } from "./auth";
import { UserFromJWT } from "./graphql/types";

export const prisma = new PrismaClient();
export type Context = {
  prisma: PrismaClient;
  isAuthenticated: boolean;
  user: UserFromJWT | null;
  res: Response;
};
export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => {
  let isAuthenticated = false;
  let user: UserFromJWT = null;

  const bearer = req.headers.authorization;

  if (bearer) {
    const [, token] = bearer.split(" ");

    try {
      user = verifyJWT(token);
      isAuthenticated = true;
    } catch (e) {
      console.log(e.message);
    }
  }

  return {
    prisma,
    isAuthenticated,
    user,
    res,
  };
};
