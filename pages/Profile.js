import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from './_app';
import contractABI from '../src/abi/MVB.json';

const CONTRACT_ADDRESS = '0x2b4407a24E602B95Cd73fa0FE3596Ce2bDe88bb1';
const MONAD_CHAIN_ID = 10143;

// Mapping для картинок каждого автора (ключи — название коллекции в нижнем регистре)
const artMappings = {
  "annae.nad": {
    total: 20,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/Annae.nad/"
  },
  "ALEX": {
    total: 9,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/ALEX/"
  },
  "dohobob": {
    total: 20,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/Dohobob/"
  },
  "gabriel": {
    total: 10,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/Gabriel/"
  },
  "pugovka_mari": {
    total: 20,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/Pugovka_Mari/"
  },
  "akellaa2023": {
    total: 7,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/akellaa2023/"
  },
  "avader": {
    total: 20,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/avader/"
  },
  "daha1522": {
    total: 12,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/daha1522/"
  },
  "n1nja0207": {
    total: 19,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/n1nja0207/"
  },
  "solncestoyaniee": {
    total: 20,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/solncestoyaniee/"
  },
  "twistzz666": {
    total: 28,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/twistzz666/"
  },
  "weeklang": {
    total: 16,
    baseUrl:
      "https://blush-native-planarian-640.mypinata.cloud/ipfs/bafybeicrvi3jlscs46jpbtinyrgfh2gdqzccj5whkbtvql23iz3d6zaioq/weeklang/"
  }
};

// Простая функция хеширования для детерминированного выбора art
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // преобразование в 32-битное число
  }
  return Math.abs(hash);
}

function Profile() {
  const router = useRouter();
  const { address } = useContext(WalletContext);

  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) {
      // Если нет адреса, отправляем на главную
      router.push('/');
    } else {
      fetchUserNFTs();
    }
  }, [address, router]);

  const fetchUserNFTs = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('MetaMask не установлен');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== BigInt(MONAD_CHAIN_ID)) {
        throw new Error('Пожалуйста, переключитесь на сеть Monad Testnet');
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
      const totalSupply = await contract.totalSupply();
      const totalSupplyNumber = Number(totalSupply);

      const userNFTs = [];
      for (let tokenId = 1; tokenId <= totalSupplyNumber; tokenId++) {
        try {
          const owner = await contract.ownerOf(tokenId);
          if (owner.toLowerCase() === address.toLowerCase()) {
            const tokenURI = await contract.tokenURI(tokenId);

            // По умолчанию заменяем ipfs:// на публичный шлюз
            let imageUrl = tokenURI.startsWith("ipfs://")
              ? tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
              : tokenURI;

            // Если для этого tokenId в localStorage сохранён выбранный art – используем его
            const storedArt = localStorage.getItem("mintedArt_" + tokenId);
            if (storedArt) {
              imageUrl = storedArt;
            } else {
              // Определяем коллекцию по tokenURI
              const mappingKey = Object.keys(artMappings).find(key =>
                tokenURI.toLowerCase().includes(key)
              );
              if (mappingKey) {
                const mappingInfo = artMappings[mappingKey];
                // Детерминированно выбираем art по хешу tokenURI
                const artIndex = (hashString(tokenURI) % mappingInfo.total) + 1;
                imageUrl = mappingInfo.baseUrl + "art" + artIndex + ".png";
              }
            }

            userNFTs.push({
              tokenId,
              name: `NFT #${tokenId}`,
              image: imageUrl,
              tokenURI
            });
          }
        } catch (err) {
          console.error(`Ошибка при обработке токена ${tokenId}:`, err);
        }
      }

      setMintedNFTs(userNFTs);
    } catch (err) {
      console.error('Ошибка при получении NFT:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Если кошелька нет — возвращаем null (или Loading / Redirect)
  if (!address) return null;

  return (
    <div className="pageWrapper">
      <h1 className="heading">Your Personal Cabinet</h1>
      <p className="subHeading">
        Connected wallet address: <strong>{address}</strong>
      </p>

      <div className="section">
        <h2 className="sectionTitle">Your Minted NFTs</h2>
        {loading ? (
          <p className="loadingText">Loading...</p>
        ) : error ? (
          <p className="errorText">Error: {error}</p>
        ) : mintedNFTs.length === 0 ? (
          <p className="emptyText">No NFTs minted yet.</p>
        ) : (
          <div className="grid">
            {mintedNFTs.map((nft) => (
              <div key={nft.tokenId} className="nftCard">
                {nft.image && (
                  <img src={nft.image} alt={nft.name} className="nftImage" />
                )}
                <div className="nftInfo">
                  <h3 className="nftName">{nft.name}</h3>
                  <p className="nftId">Token ID: {nft.tokenId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Стили через styled-jsx --- */}
      <style jsx>{`
        .pageWrapper {
          min-height: 100vh;
          padding: 60px 20px;
          background: linear-gradient(135deg, #ECE1F9 0%, #F8F4FD 100%);
          font-family: Arial, sans-serif;
          color: #4A148C;
        }
        .heading {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
          font-weight: bold;
        }
        .subHeading {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          text-align: center;
        }
        .section {
          max-width: 900px;
          margin: 0 auto 40px;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 10px;
          padding: 20px;
        }
        .sectionTitle {
          margin-top: 0;
          font-size: 1.8rem;
          font-weight: bold;
          color: #6A1B9A;
          text-align: center;
        }
        .loadingText {
          text-align: center;
          color: #4A148C;
        }
        .errorText {
          text-align: center;
          color: #FF0000;
        }
        .emptyText {
          font-style: italic;
          text-align: center;
          color: #4A148C;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .nftCard {
          background-color: rgba(240, 240, 240, 0.9);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
          text-align: center;
        }
        .nftCard:hover {
          transform: translateY(-2px);
        }
        .nftImage {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .nftInfo {
          text-align: left;
        }
        .nftName {
          margin: 0 0 8px;
          font-size: 1.2rem;
          font-weight: 600;
          color: #4A148C;
        }
        .nftId {
          margin: 0;
          font-size: 0.8rem;
          color: #8E24AA;
        }

        /* --- Медиа-запросы (адаптив) --- */

        /* Для планшетов и узких экранов */
        @media (max-width: 768px) {
          .heading {
            font-size: 2rem;
          }
          .subHeading {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }
          .section {
            margin: 0 auto 30px;
            padding: 16px;
          }
          .sectionTitle {
            font-size: 1.5rem;
          }
          .grid {
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .nftImage {
            height: 200px;
          }
        }

        /* Для совсем маленьких экранов */
        @media (max-width: 480px) {
          .heading {
            font-size: 1.8rem;
          }
          .subHeading {
            font-size: 0.95rem;
          }
          .sectionTitle {
            font-size: 1.3rem;
          }
          .grid {
            grid-template-columns: 1fr;
          }
          .nftImage {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;