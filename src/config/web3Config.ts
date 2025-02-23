import { Web3AuthConfig } from '@web3auth/web3auth';

export const WEB3_NETWORK_ID = '138';
export const CHAIN_CONFIG = {
  chainId: '0x8a', // 138 in hex
  rpcTarget: process.env.NEXT_PUBLIC_RPC_URL,
  displayName: '138-Mainnet',
  blockExplorer: 'https://explorer.138.network',
  ticker: '138',
  tickerName: '138COIN',
};

export const WEB3AUTH_CONFIG: Web3AuthConfig = {
  chainConfig: CHAIN_CONFIG,
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || '',
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook', 'twitter'],
  }
};
