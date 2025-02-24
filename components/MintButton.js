import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract";

export default function MintButton({ collectionId, onMintSuccess }) {
  const [loading, setLoading] = useState(false);
  const [mintPrice, setMintPrice] = useState("0.05"); // Начальное значение цены

  // Загружаем цену минта при монтировании компонента
  useState(() => {
    const fetchMintPrice = async () => {
      try {
        const contract = await getContract();
        const collection = await contract.collections(collectionId);
        setMintPrice(ethers.formatEther(collection.mintPrice));
      } catch (error) {
        console.error("Ошибка при загрузке цены минта:", error);
      }
    };

    fetchMintPrice();
  }, [collectionId]);

  const mintNFT = async () => {
    try {
      setLoading(true);

      // Получаем контракт
      const contract = await getContract();

      // Получаем цену минта для коллекции
      const collection = await contract.collections(collectionId);
      const mintPrice = collection.mintPrice;

      // Минт NFT
      const tx = await contract.mint(collectionId, { value: mintPrice });
      await tx.wait();

      // Уведомление об успешном минте
      alert("NFT успешно заминтирован!");

      // Вызываем колбэк для обновления UI
      if (onMintSuccess) {
        onMintSuccess();
      }
    } catch (error) {
      console.error("Ошибка при минте NFT:", error);
      alert(`Ошибка при минте NFT: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={mintNFT} disabled={loading}>
      {loading ? "Minting..." : `Mint NFT (${mintPrice} MON)`}
    </button>
  );
}