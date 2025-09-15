import { Token, Pool } from "../interfaces";
import { message } from "antd";
import { useUser } from "./useUser";
import { useLoading } from "../contexts/LoadingContext";
import { useWalletClient } from "wagmi";
import { getContract } from "viem";
import { contractsConfig } from "../libs/contracts";

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

export const usePoolManager = () => {
  const { client } = useUser();
  const { setLoading } = useLoading();
  const { data: walletClient } = useWalletClient();

  if (!walletClient)
    return {
      createPool: () => Promise.resolve("failed"),
      getPool: () => Promise.resolve("failed"),
    };

  const poolManager = getContract({
    address: contractsConfig.poolManager.address as `0x${string}`,
    abi: contractsConfig.poolManager.abi,
    client: walletClient,
  });

  // 创建池子
  const createPool = async (tokenA: Token, tokenB: Token, fee: number) => {
    try {
      // 立即切换到loading状态
      setLoading(true, "正在创建流动性池...");

      // 计算初始价格 (1:1 比率)
      const sqrtPriceX96 = encodePriceSqrt(
        BigInt(10) ** BigInt(tokenA.decimals), // reserve1
        BigInt(10) ** BigInt(tokenB.decimals) // reserve0
      );

      // 获取 tick 范围
      const { tickLower, tickUpper } = getTickRange(fee);

      // 确保 token0 < token1 (Uniswap V3 约定)
      const [token0, token1] = sortTokens(tokenA.address, tokenB.address);

      // 构造创建池子的参数
      const createParams = {
        token0: token0 as `0x${string}`,
        token1: token1 as `0x${string}`,
        fee,
        tickLower: tickLower,
        tickUpper: tickUpper,
        sqrtPriceX96: sqrtPriceX96,
      };

      // 更新loading文本
      setLoading(true, "正在提交交易...");

      const hash = await poolManager.write.createAndInitializePoolIfNecessary([
        createParams,
      ]);

      // 更新loading文本
      setLoading(true, "等待交易确认...");

      const tx = await client.waitForTransactionReceipt({ hash });

      // 关闭loading
      setLoading(false);

      if (tx.status === "success") {
        message.success("池子创建成功！");
        return "success";
      } else {
        message.error("交易失败");
        return "failed";
      }
    } catch (error: any) {
      // 关闭loading
      setLoading(false);
      message.error(`创建池子失败: ${error.message || "未知错误"}`);
      return "failed";
    }
  };

  // 获取池子
  const getPool = async (tokenA: Token, tokenB: Token, fee: number) => {
    // 确保 token0 < token1 (Uniswap V3 约定)
    const [token0, token1] = sortTokens(tokenA.address, tokenB.address);
    try {
      const pools = (await poolManager.read.getAllPools()) as Pool[];
      const pool = pools.find(
        (pool: Pool) =>
          pool.token0 === token0 && pool.token1 === token1 && pool.fee === fee
      );

      return pool;
    } catch (error: any) {
      return null;
    }
  };

  return {
    createPool,
    getPool,
  };
};
