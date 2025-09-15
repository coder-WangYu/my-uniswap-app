import { useUser } from "./useUser";
import { useWalletClient } from "wagmi";
import { getContract } from "viem";
import { contractsConfig } from "../libs/contracts";
import { Token, QuoteParams } from "../interfaces";

export const useSwapRouter = () => {
  const { client } = useUser();
  const { data: walletClient } = useWalletClient();

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
  const quoteAmountOut = async (args: any) => {
    if(!args) return

    const hash = await swapRouter.write.quoteExactInput([{
      ...args,
      indexPath: [0]
    }]);
    console.log(hash)
    
    const tx = await client.waitForTransactionReceipt({ hash: hash as `0x${string}` });
    console.log(tx)
  };

  // 计算输入toAmount对应的fromAmount
  const quoteAmountIn = async (tokenIn: Token, tokenOut: Token, amountOut: bigint) => {
    // const tx = await swapRouter.read.quoteExactOutput(tokenIn, tokenOut, amountOut);
    // return tx;
  };

  return { 
    quoteAmountOut, 
    quoteAmountIn,
  };
};
