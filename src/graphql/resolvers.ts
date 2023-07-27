import { AuthenticationError, UserInputError } from "apollo-server-express";
import {
  createJWT,
  hashPassword,
  comparePasswords,
  loginCheck,
  alreadyLoggedIn,
  adminCheck,
} from "../auth";
import { GetMovieByIdArgs, FindMoviesArgs } from "./types";
import { Context } from "../context";

//Queries
const Queries = {
  //Allowing user to query a movie with its id
  getMovieById: async (args: GetMovieByIdArgs, context: Context) => {
    return await context.prisma.movie.findUnique({
      where: { id: args.movieId || undefined },
    });
  },

  //Allowing user to query a list of all the movies.
  findMovies: async (args: FindMoviesArgs, context: Context) => {
    const query = args.findString
      ? {
          OR: [
            { movieName: { contains: args.findString } },
            { description: { contains: args.findString } },
          ],
        }
      : {};

    return await context.prisma.movie.findMany({
      where: { ...query },
      take: args.take || undefined,
      skip: args.skip || undefined,
      orderBy: args.orderBy || undefined,
    });
  },
};

// Mutations

const validateAccess = async (context: Context, args, op) => {
  loginCheck(context);
  adminCheck(context, { creatorId: args.userId });

  return await op();
};

export const Mutations = {
  //Allowing user to signUp as a User
  async signUp(
    args: {
      username: string;
      email: string;
      password: string;
    },
    context: Context
  ) {
    alreadyLoggedIn(context);

    const user = await context.prisma.user.create({
      data: {
        username: args.username,
        email: args.email,
        password: await hashPassword(args.password),
      },
    });

    const token = createJWT(user);
    return token;
  },

  //Allowing user to login
  async login(
    args: {
      username: string;
      password: string;
    },
    context: Context
  ) {
    alreadyLoggedIn(context);

    const user = await context.prisma.user.findUnique({
      where: {
        username: args.username,
      },
    });

    const checkPass = await comparePasswords(args.password, user.password);

    if (!checkPass) {
      throw new UserInputError("Error: Password not correct");
    }

    const token = createJWT(user);
    return token;
  },

  //Allowing user to change their password
  async changePassword(
    args: {
      userId: number;
      password: string;
      newPassword: string;
    },
    context: Context
  ) {
    loginCheck(context);

    const user = await context.prisma.user.findUnique({
      where: {
        id: args.userId,
      },
    });

    if (user.id !== context.user.id) {
      throw new AuthenticationError("Error: Unauthorized");
    }

    const checkPass = await comparePasswords(args.password, user.password);

    if (!checkPass) {
      throw new UserInputError("Error: Password not correct");
    }

    const newPass = await hashPassword(args.newPassword);

    return await context.prisma.user.update({
      where: { id: args.userId },
      data: { password: newPass },
    });
  },

  //Allowing user to create a new movie
  async createMovie(
    args: {
      movieName: string;
      description: string;
      directorName: string;
      releaseDate: Date;
      userId: number;
    },
    context: Context
  ) {
    return validateAccess(context, args, async () => {
      return await context.prisma.movie.create({
        data: {
          movieName: args.movieName,
          description: args.description,
          directorName: args.directorName,
          releaseDate: args.releaseDate,
          creator: { connect: { id: args.userId } },
        },
      });
    });
  },

  //Allowing user to update an existing movie
  async updateMovie(
    args: {
      movieId: number;
      movieName: string;
      description: string;
      directorName: string;
      releaseDate: Date;
    },
    context: Context
  ) {
    return validateAccess(context, args, async () => {
      const movie = await context.prisma.movie.findUnique({
        where: { id: args.movieId || undefined },
      });

      return await context.prisma.movie.update({
        where: { id: args.movieId || undefined },
        data: {
          movieName: args.movieName,
          description: args.description,
          directorName: args.directorName,
          releaseDate: args.releaseDate,
        },
      });
    });
  },

  //Allowing user to delete a new movie
  async deleteMovie(args: { movieId: number }, context: Context) {
    return validateAccess(context, args, async () => {
      const movie = await context.prisma.movie.findUnique({
        where: { id: args.movieId || undefined },
      });

      return await context.prisma.movie.delete({
        where: { id: args.movieId || undefined },
      });
    });
  },
};

// Defining resolvers for GraphQL queries and mutations
const resolvers = {
  Query: Queries,
  Mutation: Mutations,
};
//exporting resolvers by default
export default resolvers;
