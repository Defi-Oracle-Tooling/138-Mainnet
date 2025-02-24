import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, CustomChainConfig } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom } from 'viem';

export class Web3AuthProvider {
  private web3auth: Web3Auth | null = null;
  private walletClient: any = null;

  async init(config: {
    clientId: string,
    chainId: string,
    rpcUrl: string
  }) {
    try {
      const chainConfig: CustomChainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x8a",
        rpcTarget: "https://rpc.138.network",
        displayName: "138 Network",
        blockExplorer: "https://explorer.138.network",
        ticker: "ETH",
        tickerName: "Ethereum"
      };

      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig: {
            chainId: "0x8a",
            rpcTarget: "https://rpc.138.network",
            displayName: "138 Network",
            blockExplorer: "https://explorer.138.network",
            ticker: "ETH",
            tickerName: "Ethereum"
          }
        }
      });

      const web3auth = new Web3Auth({
        clientId: config.clientId,
        web3AuthNetwork: "mainnet",
        chainConfig,
        privateKeyProvider: privateKeyProvider as any,
        uiConfig: {
          appName: "138 Network",
          mode: "dark",
          loginMethodsOrder: ["google", "facebook"]
        }
      });

      const openloginAdapter = new OpenloginAdapter({
        privateKeyProvider,
        adapterSettings: {
          network: "mainnet",
          uxMode: "popup",
          loginConfig: {
            google: {
              verifier: "138-network-google",
              typeOfLogin: "google",
              clientId: config.clientId
            }
          }
        }
      });

      web3auth.configureAdapter(openloginAdapter as any);
      await web3auth.initModal();
      
      this.web3auth = web3auth;
      
      if (this.web3auth.provider) {
        this.walletClient = createWalletClient({
          transport: custom(this.web3auth.provider as IProvider)
        });
      }

      return web3auth;
    } catch (error) {
      console.error("Error initializing Web3Auth", error);
      throw error;
    }
  }

  async connect() {
    if (!this.web3auth) throw new Error("Web3Auth not initialized");
    const provider = await this.web3auth.connect();
    if (provider) {
      this.walletClient = createWalletClient({
        transport: custom(provider)
      });
    }
    return this.walletClient;
  }

  async disconnect() {
    if (!this.web3auth) throw new Error("Web3Auth not initialized");
    await this.web3auth.logout();
    this.walletClient = null;
  }

  async getAddress() {
    if (!this.walletClient) throw new Error("Not connected");
    return await this.walletClient.getAddress();
  }

  async getUserInfo() {
    if (!this.web3auth) throw new Error("Web3Auth not initialized");
    return await this.web3auth.getUserInfo();
  }

  getProvider() {
    return this.web3auth?.provider ?? null;
  }
}
