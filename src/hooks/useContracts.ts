import { useWalletClient } from "wagmi";
import { getContract } from "viem";
import { contractsConfig } from "../libs/contracts";

export const useContracts = () => {
  const { data: walletClient } = useWalletClient();

  if (!walletClient)
    return {
      poolManager: null,
    };

  const poolManager = getContract({
    address: contractsConfig.poolManager.address as `0x${string}`,
    abi: contractsConfig.poolManager.abi,
    client: walletClient,
  });

  return {
    poolManager,
  };
};
