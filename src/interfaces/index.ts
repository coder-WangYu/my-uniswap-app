interface Token {
  symbol: string;
  name: string;
  balance?: number;
  logo?: string;
  price?: number;
  address: string;
  volume24h?: number;
}

export type { 
  Token,
};
