import { createPublicClient, http, createWalletClient } from 'viem';
import { polygon } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: polygon,
  transport: http(process.env.POLYGON_RPC || "https://polygon-rpc.com")
});

export const createWallet = (account: `0x${string}`) => 
  createWalletClient({
    account,
    chain: polygon,
    transport: http(process.env.POLYGON_RPC || "https://polygon-rpc.com")
  });
