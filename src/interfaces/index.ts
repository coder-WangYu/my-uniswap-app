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

export type { 
  Token,
};
