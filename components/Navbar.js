import { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { WalletContext } from '../pages/_app';
import Link from 'next/link';

export default function Navbar() {
  const { address, setAddress } = useContext(WalletContext);
  const [isConnecting, setIsConnecting] = useState(false);

  // Проверка подключенного кошелька
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          // Получаем список аккаунтов без запроса на подключение
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };
    checkWallet();
  }, [setAddress]);

  // Подключение кошелька
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (!window.ethereum) throw new Error('Установите MetaMask!');
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Запрашиваем доступ к аккаунтам
      await provider.send("eth_requestAccounts", []);
      // После запроса получаем список аккаунтов
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Отключение кошелька
  const disconnectWallet = () => {
    setAddress(null);
    window.localStorage.removeItem('monadWallet');
  };

  return (
    <nav className="navbar">
      <Link legacyBehavior href="/">
        <a className="brand">MonadViber</a>
      </Link>

      <div className="links">
        <Link legacyBehavior href="/about">
          <a className="navButton">About</a>
        </Link>
        <Link legacyBehavior href="/collections">
          <a className="navButton">Collections</a>
        </Link>

        <button className="navButton" disabled>
          MOAP (Soon)
        </button>
        <button className="navButton" disabled>
          Auction (Soon)
        </button>

        <Link legacyBehavior href="/Profile">
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
          <button
            onClick={connectWallet}
            className="btn"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

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
      `}</style>
    </nav>
  );
}