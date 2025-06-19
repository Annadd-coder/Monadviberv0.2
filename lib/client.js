// lib/client.js
import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT;

if (!endpoint) {
  console.error(
    '[lib/client] ERROR: NEXT_PUBLIC_GRAPH_ENDPOINT is undefined!'
  );
}

export const graphClient = new GraphQLClient(
  endpoint || 'https://api.studio.thegraph.com/query/110797/monadviver/v0.0.2'
);

console.log('[lib/client] GraphQL endpoint →', graphClient.url);