import { gql } from "@apollo/client";

// 代币列表查询
export const GET_TOKENS = gql`
  query GetTokens($first: Int, $skip: Int) {
    tokens_collection(first: $first, skip: $skip) {
      id
      decimals
      name
      symbol
      totalLiquidityUSD
      totalSupply
      totalVolumeUSD
    }
  }
`;

// 池子列表查询
export const GET_POOLS = gql`
  query GetPools($first: Int, $skip: Int) {
    pools_collection(first: $first, skip: $skip) {
      id
      fee
      token0 {
        id
        totalSupply
        symbol
      }
      token1 {
        id
        symbol
        totalSupply
      }
    }
  }
`;

// 头寸列表查询
export const GET_POSITIONS = gql`
  query GetPositions($first: Int, $skip: Int) {
    positions_collection(first: $first, skip: $skip) {
      id
      owner
      tickLower
      tickUpper
      amount0
      amount1
      liquidity
      tokenId
      token0 {
        symbol
        totalSupply
      }
      token1 {
        symbol
        totalSupply
      }
    }
  }
`;
