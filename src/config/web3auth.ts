import { Web3Auth } from "@web3auth/modal";

export const initWeb3Auth = () => {
  const web3auth = new Web3Auth({
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "",
    web3AuthNetwork: "mainnet",
    chainConfig: {
      chainNamespace: "eip155",
      chainId: "0x8A", // 138 in hex
      rpcTarget: process.env.NEXT_PUBLIC_RPC_URL,
      displayName: "138-Mainnet",
      blockExplorer: "",
      ticker: "ETH",
      tickerName: "Ethereum"
    }
  });

  return web3auth;
};
