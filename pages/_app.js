// pages/_app.js
import { createContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/globals.css'; // если у вас есть глобальные стили

export const WalletContext = createContext(null);

function MyApp({ Component, pageProps }) {
  const [address, setAddress] = useState(null);

  // При загрузке проверяем, не сохранён ли адрес в localStorage (если хотите)
  useEffect(() => {
    const savedAddr = window.localStorage.getItem('monadWallet');
    if (savedAddr) {
      setAddress(savedAddr);
    }
  }, []);

  // Сохраняем каждый раз, как меняется address
  useEffect(() => {
    if (address) {
      window.localStorage.setItem('monadWallet', address);
    } else {
      window.localStorage.removeItem('monadWallet');
    }
  }, [address]);

  return (
    <WalletContext.Provider value={{ address, setAddress }}>
      <Navbar />
      <Component {...pageProps} />
    </WalletContext.Provider>
  );
}

export default MyApp;