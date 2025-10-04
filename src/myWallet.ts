import { Wallet, getWalletConnectConnector } from '@rainbow-me/rainbowkit';

export interface MyWalletOptions {
  projectId: string;
}

export const DyWallet = ({ projectId }: MyWalletOptions): Wallet => ({
  id: 'DyWallet',
  name: 'DyWallet',
  iconUrl: 'https://my-image.xyz',
  iconBackground: '#0c2f78',
  createConnector: getWalletConnectConnector({ projectId }),
});