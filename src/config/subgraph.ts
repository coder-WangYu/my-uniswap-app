export const SUBGRAPH_CONFIG = {
  // 本地开发环境
  local: {
    // url: "http://localhost:8000/subgraphs/name/my-uniswap-subgraph",
    url: "https://api.studio.thegraph.com/query/120041/my-uniswap-subgraph/0.0.7",
    wsUrl: "ws://localhost:8000/subgraphs/name/my-uniswap-subgraph",
  },
  // 生产环境（部署到The Graph Studio后）
  production: {
    url: "https://api.studio.thegraph.com/query/120041/my-uniswap-subgraph/0.0.7",
    wsUrl:
      "wss://api.studio.thegraph.com/query/YOUR_DEPLOYMENT_ID/my-uniswap-subgraph/0.0.2",
  },
};

//   export const getSubgraphUrl = () => {
//     return process.env.NODE_ENV === 'production'
//       ? SUBGRAPH_CONFIG.production.url
//       : SUBGRAPH_CONFIG.local.url
//   }

// TODO: 先在本地环境进行测试
export const getSubgraphUrl = () => SUBGRAPH_CONFIG.local.url;
