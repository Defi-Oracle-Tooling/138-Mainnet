import { createContext, useContext, ReactNode } from 'react';
import { useWeb3Auth } from '../hooks/useWeb3Auth';

type Web3AuthContextType = ReturnType<typeof useWeb3Auth>;

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const web3AuthUtils = useWeb3Auth();
  
  return (
    <Web3AuthContext.Provider value={web3AuthUtils}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3AuthContext() {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3AuthContext must be used within a Web3AuthProvider');
  }
  return context;
}
