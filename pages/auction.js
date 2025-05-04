import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ethers, parseEther, formatEther, BigNumber } from 'ethers';
import contractABI from '../src/abi/MVB.json';

const CONTRACT_ADDRESS = '0xcD9e480b7A66128eDf5f935810681CbD6E8461f0';
const MONAD_CHAIN_ID = 10143;

function AuctionDashboard() {
  const router = useRouter();
  const [address, setAddress] = useState(null);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [bidInputs, setBidInputs] = useState({}); // { tokenId: bidValue }
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Получаем адрес пользователя из MetaMask при монтировании компонента
  useEffect(() => {
    async function getAddress() {
      if (!window.ethereum) {
        setError("MetaMask не установлен");
        return;
      }
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
      } catch (err) {
        setError(err.message || "Ошибка при получении адреса");
      }
    }
    getAddress();
  }, []);

  // После получения адреса запускаем инициализацию
  useEffect(() => {
    if (address) {
      initDashboard();
    }
  }, [address]);

  async function initDashboard() {
    try {
      setLoading(true);
      setError(null);
      if (!window.ethereum) throw new Error("MetaMask не установлен");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await checkNetwork(provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);
      await fetchAuctions(contract);
    } catch (err) {
      console.error(err);
      setError(err.message || "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  async function checkNetwork(provider) {
    const network = await provider.getNetwork();
    if (network.chainId !== MONAD_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(MONAD_CHAIN_ID) }],
        });
      } catch (switchError) {
        throw new Error("Пожалуйста, переключитесь на сеть Monad Testnet");
      }
    }
  }

  async function fetchAuctions(contract) {
    try {
      const totalSupplyBN = await contract.totalSupply();
      const totalSupply = totalSupplyBN.toNumber();
      const auctionsArr = [];

      for (let i = 0; i < totalSupply; i++) {
        try {
          const tokenIdBN = await contract.tokenByIndex(i);
          const tokenId = tokenIdBN.toString();
          const auctionData = await contract.auctions(tokenId);
          if (auctionData.isActive) {
            const metadata = await fetchMetadata(contract, tokenId);
            auctionsArr.push({
              tokenId,
              seller: auctionData.seller,
              startPrice: formatEther(auctionData.startPrice),
              highestBid: formatEther(auctionData.highestBid),
              startPriceBN: auctionData.startPrice, // BigNumber
              highestBidBN: auctionData.highestBid, // BigNumber
              endTime: auctionData.endTime.toNumber(),
              image: metadata.image || "",
            });
          }
        } catch (err) {
          console.error(`Ошибка для индекса ${i}:`, err);
          continue;
        }
      }
      setActiveAuctions(auctionsArr);
    } catch (err) {
      throw new Error(`Ошибка при получении аукционов: ${err.message}`);
    }
  }

  async function fetchMetadata(contract, tokenId) {
    try {
      const uri = await contract.tokenURI(tokenId);
      const resolvedUri = uri.startsWith("ipfs://")
        ? "https://ipfs.io/ipfs/" + uri.split("ipfs://")[1]
        : uri;
      const response = await fetch(resolvedUri);
      if (!response.ok) throw new Error("Ошибка при получении метаданных");
      return await response.json();
    } catch (err) {
      console.error(`Ошибка метаданных для токена ${tokenId}:`, err);
      return { image: "" };
    }
  }

  async function handleBid(tokenId) {
    const bidVal = bidInputs[tokenId];
    if (!bidVal || isNaN(bidVal)) {
      alert("Введите корректную сумму в MON");
      return;
    }
    try {
      setProcessing(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      const auctionData = await contract.auctions(tokenId);
      // auctionData.highestBid и auctionData.startPrice – BigNumber
      const currentBidBN = auctionData.highestBid;
      const startPriceBN = auctionData.startPrice;
      const bidValueWei = parseEther(bidVal);

      console.log("currentBid:", currentBidBN.toString());
      console.log("startPrice:", startPriceBN.toString());
      console.log("bidValueWei:", bidValueWei.toString());

      // Проверяем, что ставка больше и текущей, и стартовой цены
      if (!(bidValueWei.gt(currentBidBN) && bidValueWei.gt(startPriceBN))) {
        const minRequired = currentBidBN.gt(startPriceBN) ? currentBidBN : startPriceBN;
        alert(`Ставка должна быть больше ${formatEther(minRequired)} MON`);
        return;
      }

      // Оценка газа
      let gasEstimate;
      try {
        gasEstimate = await contract.estimateGas.bid(tokenId, { value: bidValueWei });
        console.log("Gas estimate:", gasEstimate.toString());
      } catch (estimateError) {
        console.error("Ошибка оценки газа:", estimateError);
        alert("Ошибка: Проверьте, что ваша ставка больше текущей и стартовой цены");
        return;
      }

      const tx = await contract.bid(tokenId, { value: bidValueWei, gasLimit: gasEstimate });
      await tx.wait();
      alert("Ставка успешно сделана!");
      // Сбрасываем значение ставки для этого токена
      setBidInputs(prev => ({ ...prev, [tokenId]: "" }));
      initDashboard();
    } catch (err) {
      console.error("Ошибка при ставке:", err);
      alert(err.reason || err.message || "Ошибка при размещении ставки");
    } finally {
      setProcessing(false);
    }
  }

  const handleInputChange = (tokenId, value) => {
    setBidInputs(prev => ({ ...prev, [tokenId]: value }));
  };

  if (!address) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Подключение кошелька...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Auction Dashboard</h1>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Загрузка аукционов...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>
      ) : activeAuctions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Нет активных аукционов</div>
      ) : (
        activeAuctions.map((auc) => (
          <div
            key={auc.tokenId}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            {auc.image && (
              <img
                src={auc.image}
                alt={`Token #${auc.tokenId}`}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <h3>Token #{auc.tokenId}</h3>
            <p>Seller: {auc.seller}</p>
            <p>Starting Price: {auc.startPrice} MON</p>
            <p>Current Bid: {auc.highestBid} MON</p>
            <p>Ends: {new Date(auc.endTime * 1000).toLocaleString()}</p>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <input
                type="number"
                step="0.01"
                placeholder="Bid in MON"
                value={bidInputs[auc.tokenId] || ""}
                onChange={(e) => handleInputChange(auc.tokenId, e.target.value)}
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  flex: '1',
                }}
              />
              <button
                onClick={() => handleBid(auc.tokenId)}
                disabled={processing}
                style={{
                  padding: '8px 12px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
              >
                {processing ? "Processing..." : "Place Bid"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AuctionDashboard;