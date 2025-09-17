import { useWalletClient } from "wagmi";
import { formatEther, getContract, parseEther } from "viem";
import { contractsConfig } from "../libs/contracts";
import { Pool } from "../interfaces";
import { useLoading } from "../contexts/LoadingContext";
import { usePoolManager } from "./usePoolManager";
import { encodeSqrtRatioX96 } from "@uniswap/v3-sdk";
import { useUser } from "./useUser";

export const useSwapRouter = () => {
  const { address, client } = useUser()
  const { data: walletClient } = useWalletClient();
  const { setLoading } = useLoading();
  const { getPools } = usePoolManager();
  const slippage = 0.5; // 固定滑点

  if (!walletClient)
    return {
      quoteAmountOut: () => Promise.resolve("failed"),
      quoteAmountIn: () => Promise.resolve("failed"),
      executeSwap: () => Promise.resolve("failed"),
    };

  const swapRouter = getContract({
    address: contractsConfig.swapRouter.address as `0x${string}`,
    abi: contractsConfig.swapRouter.abi,
    client: walletClient,
  });

  // 自动报价：计算toAmount
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
        sqrtPriceLimitX96: BigInt(encodeSqrtRatioX96(100, 1).toString()),
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

  // 自动报价：计算fromAmount
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
        sqrtPriceLimitX96: BigInt(encodeSqrtRatioX96(100, 1).toString()),
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

  // 执行交换功能
  const executeSwap = async (
    from: string,
    to: string,
    amount: string,
    flag: "from" | "to"
  ) => {
    setLoading(true, "正在获取流动性池...");

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
    let params = {};

    setLoading(true, "正在构造参数...");
    if (flag === "from") {
      const amountIn = parseEther(amount);

      // 获取amountOut最小值
      const amountOut = await quoteAmountOut(from, to, amount);
      if (!amountOut) {
        throw new Error("获取报价失败");
      }
      const amountOutMinimum =
        (parseEther(amountOut) * BigInt(Math.floor((100 - slippage) * 100))) /
        10000n;

      // 构造参数
      params = {
        tokenIn: from as `0x${string}`,
        tokenOut: to as `0x${string}`,
        indexPath,
        amountIn,
        amountOutMinimum,
        recipient: address as `0x${string}`,
        deadline: Math.floor(Date.now() / 1000) + 3600,
        sqrtPriceLimitX96: BigInt(encodeSqrtRatioX96(100, 1).toString())
      };
    } else {
      const amountOut = parseEther(amount);

      // 获取amountOunt最小值
      const amountIn = await quoteAmountIn(from, to, amount);
      if (!amountIn) {
        throw new Error("获取报价失败");
      }
      const amountInMaximum =
        (parseEther(amountIn) * BigInt(Math.floor((100 - 5) * 100))) /
        10000n;

      // 构造参数
      params = {
        tokenIn: from as `0x${string}`,
        tokenOut: to as `0x${string}`,
        indexPath,
        amountOut,
        amountInMaximum,
        recipient: address as `0x${string}`,
        deadline: Math.floor(Date.now() / 1000) + 3600,
        sqrtPriceLimitX96: BigInt(encodeSqrtRatioX96(0, 1).toString())
      };
    }

    try {
      console.log(params)
      setLoading(true, "正在执行交换...");

      if(flag === "from") {
        const hash = await swapRouter.write.exactInput([params])

        setLoading(true, "等待交易确认...");
        
        const tx = await client.waitForTransactionReceipt({hash})
        setLoading(false);
        return tx.status
      } else {
        const hash = await swapRouter.write.exactOutput([params])

        setLoading(true, "等待交易确认...");

        const tx = await client.waitForTransactionReceipt({hash})
        setLoading(false);
        return tx.status
      }
    } catch (error) {
      setLoading(false);
      throw new Error(`执行交换失败: ${error}`);
    }
  };

  return {
    quoteAmountOut,
    quoteAmountIn,
    executeSwap,
  };
};
