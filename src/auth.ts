import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { UserFromJWT } from "./graphql/types";
import { Context } from "./context";

//create JWT Token
export const createJWT = (user: User) => {
  const token = jwt.sign(
    <UserFromJWT>{
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );
  return token;
};

//hash the password using bcrypt
export const hashPassword = async (password: String) => {
  return await bcrypt.hash(password, 5);
};

//compare the password received with the hash using compare method of bcrypt
export const comparePasswords = async (password: String, hash: String) => {
  return await bcrypt.compare(password, hash);
};

//verify the JWT token
export const verifyJWT = (e: string) => {
  return jwt.verify(e, process.env.JWT_SECRET as string);
};

//check the login for the user
export const loginCheck = (context: Context) => {
  if (!context.isAuthenticated) {
    throw new AuthenticationError("Error: Authentication Failed");
  }
};

//if user already logged in, prevent from loggin in again
export const alreadyLoggedIn = (context: Context) => {
  if (context.isAuthenticated) {
    throw new AuthenticationError("Error: Already Logged In!");
  }
};

//stop user from to make changes if not admin. This would inhibit unauthorized users from making changes to the movie
export const adminCheck = (context: Context, movie) => {
  if (movie.creatorId !== context.user.id) {
    throw new ForbiddenError("Error: Unauthorized");
  }
};
