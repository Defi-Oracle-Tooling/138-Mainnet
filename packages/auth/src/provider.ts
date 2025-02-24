import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, CustomChainConfig } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom, WalletClient } from 'viem';

interface ChainConfig {
  chainId: string;
  rpcTarget: string;
  displayName: string;
  blockExplorerUrl: string;
  ticker: string;
  tickerName: string;
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  '1': {
    chainId: "0x1",
    rpcTarget: "https://eth.llamarpc.com",
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum"
  },
  '10': {
    chainId: "0xa",
    rpcTarget: "https://mainnet.optimism.io",
    displayName: "Optimism",
    blockExplorerUrl: "https://optimistic.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum"
  },
  '25': {
    chainId: "0x19",
    rpcTarget: "https://cronos-evm.publicnode.com",
    displayName: "Cronos Mainnet",
    blockExplorerUrl: "https://cronoscan.com",
    ticker: "CRO",
    tickerName: "Cronos"
  },
  '56': {
    chainId: "0x38",
    rpcTarget: "https://bsc-dataseed.binance.org",
    displayName: "BNB Smart Chain",
    blockExplorerUrl: "https://bscscan.com",
    ticker: "BNB",
    tickerName: "BNB"
  },
  '100': {
    chainId: "0x64",
    rpcTarget: "https://gnosis-mainnet.public.blastapi.io",
    displayName: "Gnosis Chain",
    blockExplorerUrl: "https://gnosisscan.io",
    ticker: "xDAI",
    tickerName: "xDAI"
  },
  '137': {
    chainId: "0x89",
    rpcTarget: "https://polygon-rpc.com",
    displayName: "Polygon Mainnet",
    blockExplorerUrl: "https://polygonscan.com",
    ticker: "MATIC",
    tickerName: "Polygon"
  },
  '138': {
    chainId: "0x8a",
    rpcTarget: "https://rpc.defi-oracle.io",
    displayName: "Defi Oracle Meta Mainnet",
    blockExplorerUrl: "https://blockscout.defi-oracle.io",
    ticker: "ETH",
    tickerName: "Ether"
  },
  '250': {
    chainId: "0xfa",
    rpcTarget: "https://rpc.ftm.tools",
    displayName: "Fantom Opera",
    blockExplorerUrl: "https://ftmscan.com",
    ticker: "FTM",
    tickerName: "Fantom"
  },
  '5000': {
    chainId: "0x1388",
    rpcTarget: "https://rpc.mantle.xyz",
    displayName: "Mantle",
    blockExplorerUrl: "https://explorer.mantle.xyz",
    ticker: "MNT",
    tickerName: "Mantle"
  },
  '8453': {
    chainId: "0x2105",
    rpcTarget: "https://mainnet.base.org",
    displayName: "Base",
    blockExplorerUrl: "https://basescan.org",
    ticker: "ETH",
    tickerName: "Ethereum"
  }
} as const;

export class Web3AuthProvider {
  private web3auth: Web3Auth | null = null;
  private walletClient: WalletClient | null = null;

  async init(config: {
    clientId: string,
    chainId: keyof typeof SUPPORTED_CHAINS,
    rpcUrl?: string
  }): Promise<Web3Auth> {
    try {
      const chainConfig: CustomChainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        ...SUPPORTED_CHAINS[config.chainId],
        // Override rpcTarget if custom rpcUrl is provided
        ...(config.rpcUrl ? { rpcTarget: config.rpcUrl } : {})
      };

      const { blockExplorerUrl, ...chainConfigRest } = chainConfig;
      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { 
          chainConfig: { 
            ...chainConfigRest,
            blockExplorer: blockExplorerUrl || '',
            displayName: chainConfigRest.displayName || 'Unknown Network',
            ticker: chainConfigRest.ticker || 'ETH',
            tickerName: chainConfigRest.tickerName || 'Ethereum',
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
        }) as WalletClient;
      }

      return web3auth;
    } catch (error) {
      console.error("Error initializing Web3Auth", error);
      throw error;
    }
  }

  async connect(): Promise<WalletClient> {
    if (!this.web3auth) throw new Error("Web3Auth not initialized");
    const provider = await this.web3auth.connect();
    if (!provider) throw new Error("Failed to connect provider");
    
    this.walletClient = createWalletClient({
      transport: custom(provider)
    }) as WalletClient;
    
    return this.walletClient;
  }

  async disconnect(): Promise<void> {
    if (!this.web3auth) throw new Error("Web3Auth not initialized");
    await this.web3auth.logout();
    this.walletClient = null;
  }

  async getAddress(): Promise<`0x${string}`> {
    if (!this.walletClient) throw new Error("Not connected");
    const [address] = await this.walletClient.getAddresses();
    return address;
  }

  async getUserInfo(): Promise<any> {
    if (!this.web3auth) throw new Error("Web3Auth not initialized");
    return await this.web3auth.getUserInfo();
  }

  getProvider(): IProvider | null {
    return this.web3auth?.provider ?? null;
  }
}
