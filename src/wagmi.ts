import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  sepolia,
} from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'MyUniswap',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    sepolia
  ],
  transports: {
    [sepolia.id]: http("https://sepolia.infura.io/v3/bd53db44b045458e827701c6bc02a161")
  },
  ssr: true,
});
