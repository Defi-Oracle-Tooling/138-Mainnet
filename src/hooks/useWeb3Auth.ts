import { useState, useEffect } from 'react';
import { Web3Auth } from '@web3auth/web3auth';
import { WEB3AUTH_CONFIG } from '../config/web3Config';

export const useWeb3Auth = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth(WEB3AUTH_CONFIG);
        await web3auth.initModal();
        setWeb3auth(web3auth);
      } catch (error) {
        console.error('Error initializing Web3Auth:', error);
      }
    };

    init();
  }, []);

  const connect = async () => {
    if (!web3auth) return;
    try {
      await web3auth.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  return { web3auth, isConnected, connect };
};
