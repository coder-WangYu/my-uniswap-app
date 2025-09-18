import { getContract } from "viem";
import { useWalletClient } from "wagmi";
import { useLoading } from "../contexts/LoadingContext";
import { useUser } from "./useUser";
import { contractsConfig } from "../libs/contracts";
import { PositionParams } from "../interfaces";

export const usePositionManager = () => {
  const { client } = useUser();
  const { setLoading } = useLoading();
  const { data: walletClient } = useWalletClient();

  if (!walletClient)
    return {
      addLiquidity: () => Promise.resolve("failed"),
    };

  const positionManager = getContract({
    address: contractsConfig.positionManager.address as `0x${string}`,
    abi: contractsConfig.positionManager.abi,
    client: walletClient,
  });

  const addLiquidity = async (positionParams: PositionParams) => {
    try {
      setLoading(true, "正在创建头寸...");
      const hash = await positionManager.write.mint([positionParams]);

      setLoading(true, "等待交易确认...");
      const tx = await client.waitForTransactionReceipt({ hash });

      setLoading(false);
      return tx.status;
    } catch (error) {
      setLoading(false);
      return "false";
    }
  };

  return {
    addLiquidity,
  };
};
