import { Token } from "../interfaces";
import { message } from "antd";
import { useUser } from "./useUser";
import { useContracts } from "./useContracts";

// Uniswap V3 价格计算相关常量
const Q96 = BigInt(2) ** BigInt(96);

// 价格转换函数：从价格比率计算 sqrtPriceX96
// 假设初始价格比率为 1:1（token0:token1）
const encodePriceSqrt = (reserve1: bigint, reserve0: bigint): bigint => {
  return (reserve1 * Q96) / reserve0;
};

// 从费率计算 tick 范围的简化版本
const getTickRange = (
  fee: number
): { tickLower: number; tickUpper: number } => {
  // 根据费率设置不同的 tick 范围
  switch (fee) {
    case 500: // 0.05%
      return { tickLower: -60, tickUpper: 60 }; // 较小范围，适合稳定币
    case 3000: // 0.3%
      return { tickLower: -887220, tickUpper: 887220 }; // 全范围流动性
    case 10000: // 1%
      return { tickLower: -887220, tickUpper: 887220 }; // 全范围流动性
    default:
      return { tickLower: -887220, tickUpper: 887220 };
  }
};

// 代币排序
const sortTokens = (tokenA: string, tokenB: string) => {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
};

export const useCreatePool = () => {
  const { client } = useUser();
  const { poolManager } = useContracts();

  const createPool = async (tokenA: Token, tokenB: Token, fee: number) => {
    try {
      if (!poolManager) {
        return message.error("请先连接钱包");
      }
      // 计算初始价格 (1:1 比率)
      const sqrtPriceX96 = encodePriceSqrt(
        BigInt(10) ** BigInt(tokenA.decimals), // reserve1
        BigInt(10) ** BigInt(tokenB.decimals) // reserve0
      );

      // 获取 tick 范围
      const { tickLower, tickUpper } = getTickRange(fee);

      // 确保 token0 < token1 (Uniswap V3 约定)
      const [token0, token1] = sortTokens(tokenA.address, tokenB.address)

      // 构造创建池子的参数
      const createParams = {
        token0: token0 as `0x${string}`,
        token1: token1 as `0x${string}`,
        fee,
        tickLower: tickLower,
        tickUpper: tickUpper,
        sqrtPriceX96: sqrtPriceX96,
      };

      const hash = await poolManager.write.createAndInitializePoolIfNecessary([
        createParams,
      ]);
      const tx = await client.waitForTransactionReceipt({ hash });
      return tx.status
    } catch (error: any) {
      throw new error
    }
  };

  return {
    createPool,
  };
};
