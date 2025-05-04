// components/Navbar.js
import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { WalletContext } from '../pages/_app';
import Link from 'next/link';

export default function Navbar() {
  const { address, setAddress } = useContext(WalletContext);
  const [isConnecting, setIsConnecting] = useState(false);
  const providerRef = useRef(null);          // ⬅️ убрали дженерик

  /* -------------------------------------------------- */
  /*  Provider + event listeners set‑up (once, on mount) */
  /* -------------------------------------------------- */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    providerRef.current = new ethers.BrowserProvider(window.ethereum);

    const handleAccountsChanged = (accounts) => {      // ⬅️ убрали тип
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
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [setAddress]);

  /* ----------------------------------------------- */
  /*  Restore previous session or silently check auth */
  /* ----------------------------------------------- */
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
        console.error('Error restoring wallet session:', err);
      }
    };

    restoreSession();
  }, [setAddress]);

  /* ---------------------------- */
  /*  Connect / disconnect wallet */
  /* ---------------------------- */
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('MetaMask not found. Please install it to continue.');
      return;
    }

    if (isConnecting) return; // guard

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
        alert('Запрос уже открыт в MetaMask. Подтвердите его, пожалуйста.');
      } else if (err?.code === 4001) {
        console.info('User rejected wallet connection.');
      } else {
        console.error('Wallet connection error:', err);
        alert(err?.message || 'Failed to connect wallet.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, setAddress]);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    window.localStorage.removeItem('monadWallet');
  }, [setAddress]);

  /* ------------- */
  /*  Render JSX   */
  /* ------------- */
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
        <button className="navButton" disabled>
          MOAP (Soon)
        </button>
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

      {/* ✅ Styles kept identical to previous version for visual consistency */}
      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #ffffff;
          border-bottom: 1px solid #e0e0e0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
        .brand {
          font-family: 'Playfair Display', serif;
          background: linear-gradient(90deg, #8e44ad, #c39bd3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 1.8rem;
          font-weight: bold;
          text-decoration: none;
        }
        .links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        .navButton {
          display: inline-block;
          padding: 0.6rem 1rem;
          background: linear-gradient(45deg, #8e44ad, #c39bd3);
          border-radius: 8px;
          color: #ffffff;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: none;
          cursor: pointer;
        }
        .navButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .navButton:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .walletInfo {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .address {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #8e44ad;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          background: linear-gradient(45deg, #8e44ad, #c39bd3);
          color: #ffffff;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .disconnect {
          background: linear-gradient(45deg, #7d3c98, #af7ac5);
        }
        .disconnect:hover:not(:disabled) {
          transform: scale(1.05);
        }
        /* Responsive tweaks */
        @media (max-width: 992px) {
          .brand {
            font-size: 1.6rem;
          }
          .navButton,
          .btn {
            padding: 0.5rem 1rem;
          }
        }
        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
            flex-wrap: wrap;
          }
          .brand {
            margin-bottom: 0.5rem;
          }
          .links {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0.8rem;
          }
          .navButton,
          .btn {
            padding: 0.5rem 0.8rem;
            font-size: 0.9rem;
          }
          .walletInfo {
            gap: 0.8rem;
          }
        }
        @media (max-width: 480px) {
          .brand {
            font-size: 1.4rem;
          }
          .navButton,
          .btn {
            font-size: 0.85rem;
            padding: 0.4rem 0.6rem;
          }
          .links {
            gap: 0.6rem;
          }
          .walletInfo {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
}
