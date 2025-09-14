import { useAccount } from "wagmi";
import { formatEther, http, createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import { contractsConfig } from "../libs/contracts";
import { Token } from "../interfaces";
import "dotenv/config";

export const useUser = () => {
  const { address, isConnected } = useAccount();
  
  const client = createPublicClient({
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_INFURA_URL),
  });

  // 获取余额的函数
  const getTokenBalance = async (tokenInfo: Token) => {
    if (!address) return null;

    if (tokenInfo.symbol === "ETH") {
      // 原生代币
      const balance = await client.getBalance({
        address: address as `0x${string}`,
      });
      return Number(formatEther(balance)).toFixed(4);
    } else {
      // ERC20代币
      const balance = await client.readContract({
        address: tokenInfo.address as `0x${string}`,
        abi: contractsConfig.erc20.abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      });
      return Number(formatEther(BigInt(balance as string))).toFixed(4);
    }
  };

  return {
    client,
    address,
    isConnected,
    isWalletConnected: isConnected && !!address,
    getTokenBalance,
  };
};
