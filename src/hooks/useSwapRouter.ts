import { useWalletClient } from "wagmi";
import { formatEther, getContract, parseEther } from "viem";
import { contractsConfig } from "../libs/contracts";
import { Pool } from "../interfaces";
import { useLoading } from "../contexts/LoadingContext";
import { usePoolManager } from "./usePoolManager";
import { encodeSqrtRatioX96 } from "@uniswap/v3-sdk";

export const useSwapRouter = () => {
  const { data: walletClient } = useWalletClient();
  const { setLoading } = useLoading();
  const { getPools } = usePoolManager();

  if (!walletClient)
    return {
      quoteAmountOut: () => Promise.resolve("failed"),
      quoteAmountIn: () => Promise.resolve("failed"),
    };

  const swapRouter = getContract({
    address: contractsConfig.swapRouter.address as `0x${string}`,
    abi: contractsConfig.swapRouter.abi,
    client: walletClient,
  });

  // 计算输入fromAmount对应的toAmount
  const quoteAmountOut = async (from: string, to: string, amount: string) => {
    try {
      setLoading(true, "正在获取报价...");

      // 检查getPools函数是否存在
      if (!getPools) {
        throw new Error("getPools函数不可用");
      }

      // 获取该币对的流动性池
      const pools = await getPools(from, to);

      if (!pools.length) {
        throw new Error("该币对没有流动性池");
      }

      const indexPath = pools.map((pool: Pool) => pool.index);

      const params = {
        tokenIn: from as `0x${string}`,
        tokenOut: to as `0x${string}`,
        amountIn: parseEther(amount),
        indexPath,
        sqrtPriceLimitX96: BigInt(encodeSqrtRatioX96(100, 1).toString())
      };

      const amountOut = await swapRouter.read.quoteExactInput([params]);
      
      if (!amountOut) {
        throw new Error("获取报价失败，合约返回空值");
      }

      setLoading(false);
      return Number(formatEther(amountOut as bigint)).toFixed(4);

    } catch (error: any) {
      setLoading(false);
      
      // 根据错误类型提供更具体的错误信息
      if (error.message?.includes("SPL")) {
        throw new Error("价格限制过严，请调整滑点设置");
      } else if (error.message?.includes("revert")) {
        throw new Error("合约调用失败，请检查参数");
      } else if (error.message?.includes("insufficient")) {
        throw new Error("流动性不足");
      } else if (error.message?.includes("timeout")) {
        throw new Error("网络超时，请重试");
      } else {
        throw new Error(`获取报价失败: ${error.message || error}`);
      }
    }
  };

  // 计算输入toAmount对应的fromAmount
  const quoteAmountIn = async (from: string, to: string, amount: string) => {
    try {
      setLoading(true, "正在获取报价...");

      // 检查getPools函数是否存在
      if (!getPools) {
        throw new Error("getPools函数不可用");
      }

      // 获取该币对的流动性池
      const pools = await getPools(from, to);

      if (!pools.length) {
        throw new Error("该币对没有流动性池");
      }

      const indexPath = pools.map((pool: Pool) => pool.index);

      const params = {
        tokenIn: from as `0x${string}`,
        tokenOut: to as `0x${string}`,
        amountOut: parseEther(amount),
        indexPath,
        sqrtPriceLimitX96: BigInt(encodeSqrtRatioX96(100, 1).toString())
      };
      
      const amountIn = await swapRouter.read.quoteExactOutput([params]);
      
      if (!amountIn) {
        throw new Error("获取报价失败，合约返回空值");
      }

      setLoading(false);
      return Number(formatEther(amountIn as bigint)).toFixed(4);

    } catch (error: any) {
      setLoading(false);
      
      // 根据错误类型提供更具体的错误信息
      if (error.message?.includes("SPL")) {
        throw new Error("价格限制过严，请调整滑点设置");
      } else if (error.message?.includes("revert")) {
        throw new Error("合约调用失败，请检查参数");
      } else if (error.message?.includes("insufficient")) {
        throw new Error("流动性不足");
      } else if (error.message?.includes("timeout")) {
        throw new Error("网络超时，请重试");
      } else {
        throw new Error(`获取报价失败: ${error.message || error}`);
      }
    }
  };

  return {
    quoteAmountOut,
    quoteAmountIn,
  };
};
