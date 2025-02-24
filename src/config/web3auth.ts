import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";
import { SUPPORTED_CHAINS } from "../packages/auth/src/provider";

const DEFAULT_CHAIN_ID = '137'; // Polygon
const chainConfig: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  ...SUPPORTED_CHAINS[DEFAULT_CHAIN_ID]
};

export const web3authConfig = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
  web3AuthNetwork: "mainnet" as const,
  chainConfig,
};

export const createWeb3Auth = () => {
  const web3auth = new Web3AuthNoModal({
    clientId: web3authConfig.clientId,
    web3AuthNetwork: web3authConfig.web3AuthNetwork,
    chainConfig,
  });

  const { blockExplorerUrl, ...chainConfigRest } = chainConfig;
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { 
      chainConfig: { 
        ...chainConfigRest,
        blockExplorer: blockExplorerUrl || ''
      }
    }
  });

  const openloginAdapter = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      network: "mainnet",
      uxMode: "popup"
    }
  });

  web3auth.configureAdapter(openloginAdapter);

  return web3auth;
};
