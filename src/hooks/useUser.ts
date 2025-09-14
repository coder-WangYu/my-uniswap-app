import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";

export const useUser = () => {
  const { address, isConnected } = useAccount();

  // 获取ETH余额
  const {
    data: balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useBalance({
    address: address,
  });

  // 格式化余额显示
  const formattedBalance = balance
    ? {
        value: balance.value,
        formatted: parseFloat(formatEther(balance.value)).toFixed(4),
        symbol: balance.symbol,
        decimals: balance.decimals,
      }
    : null;

  return {
    // 连接状态
    address,
    isConnected,

    // 余额信息
    balance: formattedBalance,
    balanceLoading,
    refetchBalance,

    // 加载状态
    isLoading: balanceLoading,

    // 工具函数
    isWalletConnected: isConnected && !!address,
  };
};
