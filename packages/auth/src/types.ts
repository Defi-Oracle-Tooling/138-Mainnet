import { IProvider } from "@web3auth/base";

export interface AuthConfig {
  chainId: string;
  clientId: string;
  web3AuthNetwork: "mainnet" | "testnet" | "cyan";
  rpcTargets: {
    [chainId: string]: string;
  };
  defaultChainId?: string;
}

export interface AuthState {
  provider: IProvider | null;
  isConnected: boolean;
  address: string | null;
  userInfo: UserInfo | null;
}

export interface UserInfo {
  email: string;
  name: string;
  profileImage: string;
  aggregateVerifier: string;
  verifier: string;
  verifierId: string;
  typeOfLogin: string;
}

export type AuthEventType = 'connected' | 'disconnected' | 'error' | 'userInfo';
export type AuthEventCallback = (data?: any) => void;
