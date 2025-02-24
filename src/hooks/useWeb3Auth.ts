import { useState, useEffect } from 'react';
import { Web3AuthProvider } from '@138-mainnet/auth';
import { CHAIN_CONFIG } from '../config/web3Config';

export const useWeb3Auth = () => {
  const [provider, setProvider] = useState<Web3AuthProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const auth = new Web3AuthProvider();
      await auth.init({
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
        chainId: CHAIN_CONFIG.chainId,
        rpcUrl: CHAIN_CONFIG.rpcTarget
      });
      setProvider(auth);
    };
    init();
  }, []);

  const connect = async () => {
    if (!provider) return;
    try {
      await provider.connect();
      const address = await provider.getAddress();
      setAddress(address);
      setIsConnected(true);
      return { address, provider };
    } catch (error) {
      console.error('Error connecting:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    if (!provider) return;
    await provider.disconnect();
    setAddress('');
    setIsConnected(false);
  };

  return {
    provider,
    isConnected,
    address,
    connect,
    disconnect
  };
};
