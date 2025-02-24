import { createPublicClient, http, PublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { type ContractFunctionParameters } from '@wagmi/core';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

export async function multicall(
  calls: ContractFunctionParameters[],
  client: PublicClient = publicClient
) {
  return client.multicall({ contracts: calls });
}
