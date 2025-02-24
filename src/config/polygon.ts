export const polygonConfig = {
  rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
  chainId: Number(process.env.POLYGON_CHAIN_ID) || 137,
  contractAddress: process.env.POLYGON_CONTRACT_ADDRESS || '',
  identity: {
    walletKey: process.env.IDENTITY_WALLET_KEY || '',
    profileData: {
      name: 'ZK Identity',
      description: 'Zero Knowledge Identity Profile'
    }
  }
};
