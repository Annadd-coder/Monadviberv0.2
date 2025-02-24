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
  "alex": {
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
      console.log('Provider подключен:', provider);

      const network = await provider.getNetwork();
      console.log('Текущая сеть:', network);

      if (network.chainId !== BigInt(MONAD_CHAIN_ID)) {
        throw new Error('Пожалуйста, переключитесь на сеть Monad Testnet');
      }

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
      console.log('Контракт подключен:', contract);

      const totalSupply = await contract.totalSupply();
      console.log('Общее количество токенов:', totalSupply.toString());
      const totalSupplyNumber = Number(totalSupply);

      const userNFTs = [];
      for (let tokenId = 1; tokenId <= totalSupplyNumber; tokenId++) {
        try {
          const owner = await contract.ownerOf(tokenId);
          console.log(`Владелец токена ${tokenId}:`, owner);

          if (owner.toLowerCase() === address.toLowerCase()) {
            const tokenURI = await contract.tokenURI(tokenId);
            console.log(`URI токена ${tokenId}:`, tokenURI);

            // По умолчанию заменяем префикс ipfs:// на публичный шлюз
            let imageUrl = tokenURI.startsWith("ipfs://")
              ? tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
              : tokenURI;

            // Если для этого tokenId в localStorage сохранён выбранный art – используем его
            const storedArt = localStorage.getItem("mintedArt_" + tokenId);
            if (storedArt) {
              imageUrl = storedArt;
            } else {
              // Если нет сохранённого значения – пытаемся определить коллекцию по tokenURI
              const mappingKey = Object.keys(artMappings).find(key =>
                tokenURI.toLowerCase().includes(key)
              );
              if (mappingKey) {
                const mappingInfo = artMappings[mappingKey];
                // Выбираем art детерминированно по хешу tokenURI
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
      console.log('Найденные NFT:', userNFTs);
    } catch (error) {
      console.error('Ошибка при получении NFT:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!address) return null;

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.heading}>Your Personal Cabinet</h1>
      <p style={styles.subHeading}>
        Connected wallet address: <strong>{address}</strong>
      </p>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Minted NFTs</h2>
        {loading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : error ? (
          <p style={styles.errorText}>Error: {error}</p>
        ) : mintedNFTs.length === 0 ? (
          <p style={styles.emptyText}>No NFTs minted yet.</p>
        ) : (
          <div style={styles.grid}>
            {mintedNFTs.map((nft) => (
              <div key={nft.tokenId} style={styles.nftCard}>
                {nft.image && (
                  <img src={nft.image} alt={nft.name} style={styles.nftImage} />
                )}
                <div style={styles.nftInfo}>
                  <h3 style={styles.nftName}>{nft.name}</h3>
                  <p style={styles.nftId}>Token ID: {nft.tokenId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #ECE1F9 0%, #F8F4FD 100%)',
    fontFamily: 'Arial, sans-serif',
    color: '#4A148C'
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  subHeading: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  section: {
    maxWidth: '900px',
    margin: '0 auto 40px',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: '10px',
    padding: '20px'
  },
  sectionTitle: {
    marginTop: 0,
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#6A1B9A',
    textAlign: 'center'
  },
  loadingText: {
    textAlign: 'center',
    color: '#4A148C'
  },
  errorText: {
    textAlign: 'center',
    color: '#FF0000'
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#4A148C'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  nftCard: {
    backgroundColor: 'rgba(240,240,240,0.9)',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    textAlign: 'center'
  },
  nftImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px'
  },
  nftInfo: {
    textAlign: 'left'
  },
  nftName: {
    margin: '0 0 8px',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#4A148C'
  },
  nftId: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#8E24AA'
  }
};

export default Profile;