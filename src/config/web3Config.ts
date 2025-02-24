import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base';

export const WEB3_NETWORK_ID = '138';
export const CHAIN_CONFIG: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x8A", // 138 in hex
  rpcTarget: process.env.NEXT_PUBLIC_RPC_URL,
  displayName: "138-Mainnet",
  blockExplorerUrl: "https://explorer.138.network",
  ticker: "138",
  tickerName: "138COIN"
};

export const WEB3AUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
  web3AuthNetwork: "mainnet",
  chainConfig: CHAIN_CONFIG,
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook', 'twitter'],
    appLogo: 'https://your-logo-url.com/logo.png',
  },
  modalConfig: {
    [CHAIN_NAMESPACES.EIP155]: {
      chainConfig: CHAIN_CONFIG,
      customAuthentication: true,
    },
  },
};
