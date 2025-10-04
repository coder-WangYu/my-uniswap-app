import {
  sepolia,
} from 'wagmi/chains';
import { http } from 'wagmi';
import "dotenv/config";
import { createConfig } from 'wagmi';
import { connectors } from './myWalletList';

export const config = createConfig({
  connectors,
  chains: [
    sepolia
  ],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_INFURA_URL)
  },
  ssr: true,
});
