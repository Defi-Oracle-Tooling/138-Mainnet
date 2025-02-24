export interface ZKModuleConfig {
  dockConfig: {
    address: string;
    apiKey: string;
  };
  polygonConfig: {
    rpcUrl: string;
    contractAddress: string;
  };
  identusConfig: {
    nodeUrl: string;
    verifierKey: string;
  };
}

export interface ZKClaim {
  subject: string;
  attributes: Record<string, any>;
  schema: string;
}

export interface ZKProof {
  id: string;
  proof: string;
  polygonProof: string;
  timestamp: number;
}

import { ZKModuleConfig } from './types';

export const defaultConfig: ZKModuleConfig = {
  dockConfig: {
    url: 'https://api.dock.io',
    apiKey: process.env.DOCK_API_KEY || ''
  },
  polygonConfig: {
    env: 'mainnet',
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    chainId: 137,
    contractAddress: process.env.POLYGON_ID_CONTRACT || '0x624ce98D2d27b20b8f8d521723Df8fC4db71D79D',
    circuitConfig: {
      circuitId: 'credentialAtomicQueryMTP',
      version: '2.0.0'
    }
  },
  identityConfig: {
    walletKey: process.env.IDENTITY_WALLET_KEY || '',
    profileData: {
      name: 'Main Identity',
      type: 'Person',
    },
    ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io'
  },
  identusConfig: {
    endpoint: 'https://api.identus.org',
    credentials: {
      clientId: process.env.IDENTUS_CLIENT_ID || '',
      clientSecret: process.env.IDENTUS_CLIENT_SECRET || ''
    }
  }
};
