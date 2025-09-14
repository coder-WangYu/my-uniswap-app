import { useAccount } from "wagmi";
import { createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";
import "dotenv/config"

export const useUser = () => {
  const { address, isConnected } = useAccount()
  
  const walletClient = createWalletClient({
    account: address,
    chain: sepolia,
    transport: http(process.env.NEXT_PUBLIC_INFURA_API),
  });
  
  return {
    address,
    isConnected,
    walletClient,
  }
}
