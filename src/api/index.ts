import { gql } from '@apollo/client'

// 代币列表查询
export const GET_TOKENS = gql`
  query GetTokens($first: Int!, $skip: Int) {
    tokens(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      name
      symbol
      decimals
      totalSupply
      totalVolumeUSD
      totalLiquidityUSD
      txCount
      priceUSD
      createdAt
      updatedAt
    }
  }
`

// 代币日度数据查询
export const GET_TOKEN_DAY_DATA = gql`
  query GetTokenDayData($tokenId: String!, $first: Int!) {
    tokenDayDatas(
      where: { token: $tokenId }
      first: $first
      orderBy: date
      orderDirection: desc
    ) {
      id
      date
      volumeUSD
      volumeETH
      txCount
      priceUSD
      liquidityUSD
      priceChangeUSD
      priceChangePercent
    }
  }
`

// 池创建事件查询
export const GET_POOL_CREATED = gql`
  query GetPoolCreated($first: Int!) {
    poolCreateds(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      token0
      token1
      index
      tickLower
      tickUpper
      fee
      pool
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`

// 交易事件查询
export const GET_SWAPS = gql`
  query GetSwaps($first: Int!) {
    swaps(first: $first, orderBy: blockTimestamp, orderDirection: desc) {
      id
      sender
      zeroForOne
      amountIn
      amountInRemaining
      amountOut
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`