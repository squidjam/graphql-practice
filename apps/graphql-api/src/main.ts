/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import fetch from 'node-fetch';

import { ApolloServer, gql } from 'apollo-server-express';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

  type Character {
    id: ID
    name: String
    image: String
  }
  
  type Query {
    
    characters(
      id: ID
      name: String
      image: String 
    ): Character
    
  }

`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    // node: (_, { id }, { services: { getObjectById } }) =>
    //     getObjectById(fromGlobalId(id)),
    characters: (_, args, { services: { findCharacters } }) =>
        findCharacters(args),
    // episodes: (_, args, { services: { findEpisodes } }) =>
    //     findEpisodes(args),
    // episode: (_, { id }, { services: { findEpisodeById } }) =>
    //     findEpisodeById(id),
    // character: (_, { id }, { services: { findCharacterById } }) =>
    //     findCharacterById(id),
  },
};

function findCharacters() {
  return fetch('https://rickandmortyapi.com/api/character/')
      .then(res => res.json())
      .then(json => json);
}

const server = new ApolloServer({ typeDefs, resolvers, context: {
  services: { findCharacters }
  } });

const app = express();
server.applyMiddleware({ app });

const port = process.env.port || 3333;
const api = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
api.on('error', console.error);
