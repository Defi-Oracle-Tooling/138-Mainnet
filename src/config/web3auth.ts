import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

const chainConfig = {
  chainNamespace: "eip155",
  chainId: "0x89", // Polygon
  rpcTarget: process.env.POLYGON_RPC || "https://polygon-rpc.com",
  displayName: "Polygon Mainnet",
  blockExplorerUrl: "https://polygonscan.com",
  ticker: "MATIC",
  tickerName: "Polygon",
};

export const web3authConfig = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
  web3AuthNetwork: "mainnet",
  chainConfig,
};

export const createWeb3Auth = () => {
  const web3auth = new Web3AuthNoModal({
    clientId: web3authConfig.clientId,
    chainConfig,
    web3AuthNetwork: web3authConfig.web3AuthNetwork,
  });

  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  const openloginAdapter = new OpenloginAdapter({
    privateKeyProvider,
  });

  web3auth.configureAdapter(openloginAdapter);

  return web3auth;
};
