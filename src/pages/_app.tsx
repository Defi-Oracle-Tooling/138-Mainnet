import type { AppProps } from 'next/app';
import { Web3AuthProvider } from '../contexts/Web3AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3AuthProvider>
      <Component {...pageProps} />
    </Web3AuthProvider>
  );
}
