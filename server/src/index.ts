import { Context } from './types/Context';
import { UserResolver } from './resolvers/user';
import { GreetingResolver } from './resolvers/greeting';
require('dotenv').config();
import 'reflect-metadata';

import { createConnection } from "typeorm";
import { User } from "./entities/User";
import express from 'express'
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const main = async() => {
  await createConnection({
    type: 'postgres',
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User]
  });

  const app = express();

  const httpServer = createServer(app)

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [GreetingResolver, UserResolver]
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer}),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
    // function return request or response
    context: ({ req, res }): Pick<Context, 'req' | 'res'> => ({ req, res }),
  })

  await apolloServer.start();
  apolloServer.applyMiddleware({app})

  const PORT = process.env.PORT || 4000
  await new Promise((resolve ) => httpServer.listen({ port: PORT}, resolve as () => void)); // cast to void

  console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
}

main().catch(error => {
  console.log('ERROR STARTING SERVER: ', error);
})