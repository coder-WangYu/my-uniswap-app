interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance?: number;
  logo?: string;
  price?: number;
  volume24h?: number;
}

interface Pool {
  fee: number;
  feeProtocol: number;
  index: number;
  liquidity: BigInt;
  pool: string;
  sqrtPriceX96: BigInt;
  tick: number;
  tickLower: number;
  tickUpper: number;
  token0: string;
  token1: string;
}

interface QuoteParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: bigint;
  sqrtPriceLimitX96: bigint;
}

interface PositionParams {
  token0: string;
  token1: string;
  index: number;
  amount0Desired: BigInt;
  amount1Desired: BigInt;
  recipient: string;
  deadline: BigInt;
}

export type { 
  Token,
  Pool,
  QuoteParams,
  PositionParams,
};
