import { useAccount } from "wagmi";
import { createWalletClient, formatEther, http, publicActions } from "viem";
import { sepolia } from "viem/chains";
import { contractsConfig } from "../libs/contracts";
import { Token } from "../interfaces";
import "dotenv/config";

export const useUser = () => {
  const { address, isConnected } = useAccount();

  // 创建钱包客户端用于发送交易
  const walletClient = createWalletClient({
    account: address,
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_INFURA_URL),
  }).extend(publicActions);

  // 获取余额的函数
  const getTokenBalance = async (tokenInfo: Token) => {
    if (!address) return null;

    if (tokenInfo.symbol === "ETH") {
      // 原生代币
      const balance = await walletClient.getBalance({
        address: address as `0x${string}`,
      });
      return Number(formatEther(balance)).toFixed(4);
    } else {
      // ERC20代币
      const balance = await walletClient.readContract({
        address: tokenInfo.address as `0x${string}`,
        abi: contractsConfig.erc20.abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      });
      return Number(formatEther(BigInt(balance as string))).toFixed(4);
    }
  };

  return {
    address,
    isConnected,
    walletClient,
    isWalletConnected: isConnected && !!address,
    getTokenBalance,
  };
};
