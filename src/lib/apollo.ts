import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { getSubgraphUrl } from "../config/subgraph";

const uri = getSubgraphUrl()

export const client = new ApolloClient({
  link: new HttpLink({ uri }),
  cache: new InMemoryCache(),
});
