// components/Navbar.js
import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { WalletContext } from '../pages/_app';
import Link from 'next/link';

export default function Navbar() {
  const { address, setAddress } = useContext(WalletContext);
  const [isConnecting, setIsConnecting] = useState(false);
  const providerRef = useRef(null);

  /* ───────────────────────────────────────────────────────────────────── */
  /* 1. Provider + события аккаунтов/цепочки */
  /* ───────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    providerRef.current = new ethers.BrowserProvider(window.ethereum);

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAddress(accounts[0]);
        window.localStorage.setItem('monadWallet', accounts[0]);
      }
    };
    const handleChainChanged = () => window.location.reload();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [setAddress]);

  /* ───────────────────────────────────────────────────────────────────── */
  /* 2. Восстановление сессии */
  /* ───────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const restoreSession = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return;
      const cached = window.localStorage.getItem('monadWallet');
      if (cached) {
        setAddress(cached);
        return;
      }
      try {
        const provider = providerRef.current ?? new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          window.localStorage.setItem('monadWallet', accounts[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    restoreSession();
  }, [setAddress]);

  /* ───────────────────────────────────────────────────────────────────── */
  /* 3. Подключение кошелька */
  /* ───────────────────────────────────────────────────────────────────── */
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return alert('MetaMask not found');
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const provider = providerRef.current ?? new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        window.localStorage.setItem('monadWallet', accounts[0]);
      }
    } catch (err) {
      if (err?.code === -32002) {
        alert('Запрос уже открыт в MetaMask, подтвердите его');
      } else if (err?.code !== 4001) {
        console.error(err);
        alert(err.message || 'Connection error');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, setAddress]);

  /* ───────────────────────────────────────────────────────────────────── */
  /* 4. Отключение кошелька */
  /* ───────────────────────────────────────────────────────────────────── */
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    window.localStorage.removeItem('monadWallet');
  }, [setAddress]);

  /* ───────────────────────────────────────────────────────────────────── */
  /* 5. Рендер */
  /* ───────────────────────────────────────────────────────────────────── */
  return (
    <nav className="navbar">
      <Link href="/" legacyBehavior>
        <a className="brand">MonadViber</a>
      </Link>

      <div className="links">
        <Link href="/about" legacyBehavior>
          <a className="navButton">About</a>
        </Link>
        <Link href="/collections" legacyBehavior>
          <a className="navButton">Collections</a>
        </Link>
        <Link href="/feed" legacyBehavior>
          <a className="navButton">Feed</a>
        </Link>
        <Link href="/moaps" legacyBehavior>
          <a className="navButton">Moap</a>
        </Link>
        <Link href="/Profile" legacyBehavior>
          <a className="navButton">Profile</a>
        </Link>

        {address ? (
          <div className="walletInfo">
            <div className="address">
              <FiUser />
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </div>
            <button onClick={disconnectWallet} className="btn disconnect">
              <FiLogOut />
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className="btn" disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          background-color: #fff;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          overflow: hidden;
          max-height: 64px;
          transition: max-height 0.3s ease-in-out;
          z-index: 1000;
        }
        .navbar:hover {
          max-height: 200px;
        }

        .brand {
          font-family: 'Playfair Display', serif;
          background: linear-gradient(90deg, #8e44ad, #c39bd3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 1.8rem;
          font-weight: bold;
          text-decoration: none;
          margin: 0 1rem;
        }

        .links {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto;
          padding: 0.5rem 1rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease-in-out;
        }
        .navbar:hover .links {
          opacity: 1;
          pointer-events: auto;
        }

        .navButton {
          padding: 0.6rem 1.2rem;
          background: linear-gradient(45deg, #8e44ad, #c39bd3);
          border-radius: 12px;
          color: #ffffff;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .navButton:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #8e44ad, #c39bd3);
          border-radius: 12px;
          color: #ffffff;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .disconnect {
          background: linear-gradient(45deg, #7d3c98, #af7ac5);
        }

        .walletInfo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .address {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #8e44ad;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .brand { font-size: 1.6rem; }
          .navButton, .btn { padding: 0.5rem 1rem; font-size: 0.9rem; }
        }
      `}</style>
    </nav>
  );
}