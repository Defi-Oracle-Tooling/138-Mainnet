import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createWeb3Auth } from '../config/web3auth';
import { createWallet, publicClient } from '../config/viem';
import type { Hash, Address } from 'viem';

export function useAuth() {
  const [web3auth] = useState(() => createWeb3Auth());
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      if (!web3auth.connected) return null;
      const userInfo = await web3auth.getUserInfo();
      const provider = await web3auth.provider;
      const address = await provider.request({ method: 'eth_accounts' }) as Address[];
      return { 
        ...userInfo, 
        address: address[0] 
      };
    },
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      await web3auth.init();
      await web3auth.connect();
    },
  });

  const signAndSendTransaction = async (to: Address, value: bigint): Promise<Hash> => {
    if (!user?.address) throw new Error('Not connected');
    const wallet = createWallet(user.address);
    const hash = await wallet.sendTransaction({
      to,
      value,
    });
    return hash;
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    isLoginPending: loginMutation.isPending,
    signAndSendTransaction,
    publicClient,
  };
}
