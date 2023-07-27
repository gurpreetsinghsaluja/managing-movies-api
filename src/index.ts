import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { typeDefs } from "./graphql/types";

import resolvers from "./graphql/resolvers";
import { createContext, Context } from "./context";

export const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,

  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
  dotenv.config();

  await server.start();

  // Use Apollo middleware
  app.use(
    "/",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: createContext,
    })
  );

  // Start server
  const port = 4001;
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: { port } }, resolve)
  );

  console.log(`Server ready http://localhost:${port}/`);
})();
