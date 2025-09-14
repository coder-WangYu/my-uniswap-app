import ERC20_ABI from "../../public/abis/ERC20.json";
import POOL_ABI from "../../public/abis/Pool.json";
import POOLMANAGER_ABI from "../../public/abis/PoolManager.json";
import POSITIONMANAGER_ABI from "../../public/abis/PositionManager.json";
import SWAPROUTER_ABI from "../../public/abis/SwapRouter.json";

// 合约配置
export const contractsConfig = {
  erc20: {
    abi: ERC20_ABI,
  },
  pool: {
    abi: POOL_ABI,
  },
  poolManager: {
    address: "0x6971599124195Ae42543b0613dF9A417D89c4944",
    abi: POOLMANAGER_ABI,
  },
  positionManager: {
    address: "0x8363bEAEc310B579D26CBdcA175E4853a7bcFDC6",
    abi: POSITIONMANAGER_ABI,
  },
  liquidityManager: {
    address: "0x8363bEAEc310B579D26CBdcA175E4853a7bcFDC6",
    abi: POSITIONMANAGER_ABI, // 使用positionManager作为流动性管理器
  },
  swapRouter: {
    address: "0x1b4692Bd0EB88cB0a0C5F0E4f6950FA30F6db94a",
    abi: SWAPROUTER_ABI,
  },
};

// 代币配置
export const tokensConfig = {
  ETH: {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // 原生ETH的特殊地址
    wrappedAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // Sepolia WETH 地址
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    isNative: true,
  },
  WYTokenA: {
    address: "0xc5C45CAe44dA4eD5F767d38ADBa00C7B56125fDa",
    symbol: "AWY",
    name: "WYToken A",
    decimals: 18,
  },
  WYTokenB: {
    address: "0x8F8d4529C06b9f8A8EA2049de9fcE5FBE99453CC",
    symbol: "BWY",
    name: "WYToken B",
    decimals: 18,
  },
  WYTokenC: {
    address: "0x330BdEE0cD752C73Df7B6EeE46fE9b5aCd4956F3",
    symbol: "CWY",
    name: "WYToken C",
    decimals: 18,
  },
  WYTokenD: {
    address: "0x28382072E60e84dfc208687Ebc4b5C1127A1652A",
    symbol: "DWY",
    name: "WYToken D",
    decimals: 18,
  },
  WYTokenE: {
    address: "0xF95395dCC008E5f9958D3482706F5fD83CF5e5Ea",
    symbol: "EWY",
    name: "WYToken E",
    decimals: 18,
  },
  WYTokenF: {
    address: "0xa627E7092412D7CFe284B4c09F09eD1547eB639C",
    symbol: "FWY",
    name: "WYToken F",
    decimals: 18,
  },
  WYTokenG: {
    address: "0x5fC1d5b191aF9C0b9f46037fb9A98b84caec26A8",
    symbol: "GWY",
    name: "WYToken G",
    decimals: 18,
  },
  WYTokenH: {
    address: "0xCCeFC1495e7454558ee8F018bC7A87b7b8a68B6e",
    symbol: "HWY",
    name: "WYToken H",
    decimals: 18,
  },
  WYTokenI: {
    address: "0x821c270Fa1AAd2f4594DDE747Ab6C5e2EabCF9af",
    symbol: "IWY",
    name: "WYToken I",
    decimals: 18,
  },
  WYTokenJ: {
    address: "0x8c30Bb23D47AD913CFe0fa38fDF68a325C459714",
    symbol: "JWY",
    name: "WYToken J",
    decimals: 18,
  },
};

// 网络配置
export const NETWORK_CONFIG = {
  chainId: 11155111, // Sepolia
  name: 'Sepolia',
  rpcUrl: 'https://rpc.sepolia.org',
  blockExplorer: 'https://sepolia.etherscan.io',
}

// 默认滑点配置
export const DEFAULT_SLIPPAGE = 0.5 // 0.5%
