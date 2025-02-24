import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Layout from '../components/Layout';
import '../styles/globals.css';

export const WalletContext = createContext(null);

export default function MyApp({ Component, pageProps }) {
  const [address, setAddress] = useState(null);

  // Инициализация кошелька
  useEffect(() => {
    const initWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          // Запрашиваем доступ к аккаунтам
          await provider.send("eth_requestAccounts", []);
          // Получаем список аккаунтов
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error initializing wallet:", error);
        }
        // Обработка смены аккаунтов
        window.ethereum.on('accountsChanged', (accounts) => {
          setAddress(accounts[0] || null);
        });
      }
    };
    initWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ address, setAddress }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletContext.Provider>
  );
}