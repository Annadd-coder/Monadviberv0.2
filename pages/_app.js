// pages/_app.js
import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export const WalletContext = createContext(null);

export default function MyApp({ Component, pageProps }) {
  const [address, setAddress] = useState(null);
  const [signer,  setSigner]  = useState(null);

  /* ────────── 1. подтягиваем адрес из localStorage (если был) ────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;          // защита SSR
    const saved = window.localStorage.getItem('monadWallet');
    if (saved) setAddress(saved);
  }, []);

  /* ────────── 2. храним адрес в localStorage ────────── */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (address) window.localStorage.setItem('monadWallet', address);
    else         window.localStorage.removeItem('monadWallet');
  }, [address]);

  /* ────────── 3. создаём signer, когда MetaMask уже авторизован ────────── */
  useEffect(() => {
    async function loadSigner() {
      if (typeof window === 'undefined' || !window.ethereum) {
        setSigner(null);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      try {
        // eth_accounts не открывает pop-up — только возвращает список
        const accounts = await provider.send('eth_accounts', []);
        if (!accounts.length) {               // MetaMask ещё не дал доступ
          setSigner(null);
          return;
        }

        const active = accounts[0];

        // синхронизируем адрес (на случай, если он не был в localStorage)
        if (!address) setAddress(active);

        // getSigner(active) НЕ триггерит eth_requestAccounts
        const s = await provider.getSigner(active);
        setSigner(s);
      } catch (err) {
        console.error('loadSigner:', err);
        setSigner(null);
      }
    }

    loadSigner();
  }, [address]);

  /* ────────── 4. реагируем на смену аккаунта/сети ────────── */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAddress(null);
        setSigner(null);
      } else {
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      // signer пересоздастся автоматически
      setSigner(null);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged',  handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged',  handleChainChanged);
    };
  }, []);

  /* ────────── 5. контекст + Toaster ────────── */
  return (
    <WalletContext.Provider value={{ address, setAddress, signer }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </WalletContext.Provider>
  );
}