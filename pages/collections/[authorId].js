// pages/collections/[authorId].js
import { useRouter } from 'next/router';
import {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import contractJSON from '@/src/abi/MVB.json';
import { WalletContext } from '../_app';

const RPC = 'https://testnet-rpc.monad.xyz';
const CHAIN_ID_DEC = 10143;
const CHAIN_ID_HEX = '0x279f';
const CONTRACT = '0xcD9e480b7A66128eDf5f935810681CbD6E8461f0';
const MAX_SUPPLY = 100;
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

/** Автор → { count, cid, collectionId } */
export const REGISTRY = {
  twistzz:        { count: 12, cid: 'bafybeif2hdabepr5je2vblwi6iivwhzne3rwmql7qhwgcn3cwhpgqqzyv4', collectionId: 2 },
  tchan4323:      { count: 10, cid: 'bafybeiff2kxd43msni7hwzycq26b45ned5b5yeuzb5xz4gfiw7jp7ma3xq', collectionId: 3 },
  solncestoyanie: { count: 10, cid: 'bafybeidnib5rcvipty6hy4p6wwvrc7ul37wz7alsdlebvefbh7fpjkfmce', collectionId: 4 },
  Richard:        { count: 10, cid: 'bafybeiao64ba6ipurjijmga6e4hyrlsmki2bkkqxqxhx7j6uturpjpts3m', collectionId: 5 },
  N1nja:          { count: 10, cid: 'bafybeihmw4h43usdknxf35jhhybusws4m3fnzykekkwnm727bocfkzvdiy', collectionId: 6 },
  miss_port:      { count: 10, cid: 'bafybeianlconikn7cv6ywphrewlbjfpvvj7uxi4sjwlryu7p22v7dvg4re', collectionId: 7 },
  lzlzlz:         { count: 10, cid: 'bafybeidb3kcti7jkbv33pgqpci5l3hd7usgjlxhdzvpvktn7ha7avurp7e', collectionId: 8 },
  kasyak:         { count: 10, cid: 'bafybeidp6q3qkg5e3sdxrpmkwqjt3zu6m5qs2kioeeq336g7gxvqdtwjuu', collectionId: 9 },
  Ishan:          { count: 10, cid: 'bafybeibspj7jah6wikgfmgxc5bmcxvxtgycqepf4zzx75c7mdp4p6vojne', collectionId: 10 },
  ghooolyache:    { count: 10, cid: 'bafybeicgcphm5r3zoogtod5teypm7olodg5akpvre534edjtixex27wyha', collectionId: 11 },
  gabriel:        { count: 10, cid: 'bafybeidx3u73jxyik5wcuyvxx24xbmpyqqi35yblytcapttlmupoc23pju', collectionId: 12 },
  Dohobob:        { count: 10, cid: 'bafybeieaxng266fbs4s4sdaazuf7czhmat4i6skyudx2d44xnrclbgbai4', collectionId: 13 },
  DayzZzer:       { count: 10, cid: 'bafybeico6ircxzelf3gsd6wd22hl3gasuclosh5mkkb2eauhko3uqh7hxa', collectionId: 14 },
  bromaxo:        { count: 10, cid: 'bafybeidkhpcpckelugdjluv4tsnlj7edcb64j2kkm3dbdjakwaz3mp275u', collectionId: 16 },
  Avader:         { count: 10, cid: 'bafybeiazcrjfw45voghatj2kj2ipaic6xomygt5ai3x5k4xpron4vwarte', collectionId: 17 },
  Antgeo:         { count: 10, cid: 'bafybeibylnlnfj7eip4m4l5tskyjzv2xjf7jr4wocjrapeskyph4ybakzq', collectionId: 18 },
  AnnaD:          { count: 10, cid: 'bafybeiclgdzyjazcsgiln6k3uhcxmjy3jjk2cvd7eodawg74t6oihky35m', collectionId: 19 },
  Akela:          { count: 10, cid: 'bafybeibptnkdylcdixqtoud5byiu35uma4z2vsqnih7z7m6ds6sj7lqgpi', collectionId: 20 },
};

const DEFAULT_PHRASES = [
  'Creativity unleashed!',
  'Feel the Monad vibes!',
  'Art beyond limits!',
  'Inspiration strikes!',
  'Colors of imagination!',
];

export default function AuthorPage() {
  const { query, isReady } = useRouter();
  const authorId = query.authorId;
  const { address, setAddress } = useContext(WalletContext);

  const [provider, setProvider]       = useState(null);
  const [currentArt, setCurrentArt]   = useState('');
  const [phrase, setPhrase]           = useState('');
  const [isMinting, setIsMinting]     = useState(false);
  const [mintStatus, setMintStatus]   = useState(null);
  const [currentSupply, setCurrentSupply] = useState(0);

  // 1. Provider
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  // 2. Meta
  const meta = useMemo(() => {
    if (!isReady || !authorId) return null;
    const cfg = REGISTRY[authorId];
    if (!cfg) return null;

    return {
      artworks: Array.from({ length: cfg.count },
        (_, i) => `${IPFS_GATEWAY}/${cfg.cid}/art${i + 1}.png`),
      phrases:      DEFAULT_PHRASES,
      collectionId: cfg.collectionId,
    };
  }, [isReady, authorId]);

  // 3. Supply
  useEffect(() => {
    if (!provider || !meta) return;
    const ctr = new ethers.Contract(CONTRACT, contractJSON.abi, provider);
    ctr.collections(meta.collectionId)
       .then((c) => setCurrentSupply(Number(c.currentSupply)))
       .catch(() => {});
  }, [provider, meta]);

  // 4. Random art
  const pickRandom = useCallback(() => {
    if (!meta) return;
    const i = Math.floor(Math.random() * meta.artworks.length);
    setCurrentArt(meta.artworks[i]);
    setPhrase(meta.phrases[Math.floor(Math.random() * meta.phrases.length)]);
  }, [meta]);

  useEffect(() => { if (meta) pickRandom(); }, [meta]);

  // 5. Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAddress(accs[0]);
  }, [setAddress]);

  // 6. Mint
  const mintNFT = useCallback(async () => {
    if (!provider) return alert('MetaMask not found');
    if (!address)  return alert('Connect wallet first');
    if (!meta)     return;

    setIsMinting(true);
    setMintStatus(null);
    try {
      const net = await provider.getNetwork();
      if (net.chainId !== CHAIN_ID_DEC) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID_HEX }],
        });
      }

      const signer = await provider.getSigner();
      const ctr    = new ethers.Contract(CONTRACT, contractJSON.abi, signer);
      const tx     = await ctr.mint(meta.collectionId, {
        value: ethers.parseEther('0.1'),
      });

      setMintStatus({ status: 'pending', tx: tx.hash });
      await tx.wait();

      const c = await ctr.collections(meta.collectionId);
      setCurrentSupply(Number(c.currentSupply));
      setMintStatus({ status: 'success', tx: tx.hash });
    } catch (e) {
      const reason = e?.reason || e?.message || '';
      if (e.code === -32002) alert('Please check MetaMask — pending request');
      setMintStatus({ status: 'error', msg: reason });
    } finally {
      setIsMinting(false);
    }
  }, [provider, address, meta]);

  if (!isReady) return <p>Loading…</p>;
  if (!meta)    return (
    <p style={{ textAlign: 'center', marginTop: '4rem' }}>Author not found</p>
  );

  return (
    <div className="container">
      {!address && (
        <button className="btn connectBtn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      <h1 className="title">{authorId}</h1>

      <section className="aboutAuthor">
        <h2>About the author</h2>
        <p>
          This talented creator makes unique NFTs on the Monad platform.
          Support their art!
        </p>
      </section>

      <div className="imageBlock">
        {currentArt && (
          <img src={currentArt} className="artImage" alt="Artwork" />
        )}
      </div>

      <p className="phrase">{phrase}</p>
      <p className="supply">
        Minted <strong>{currentSupply}</strong> / {MAX_SUPPLY}
      </p>

      <div className="btnRow">
        <motion.button
          className="btn mintBtn"
          onClick={mintNFT}
          disabled={isMinting || !address}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMinting ? 'Minting…' : 'Mint'}
        </motion.button>

        <motion.button
          className="btn nextBtn"
          onClick={pickRandom}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </div>

      <div className="followRow">
        <a
          href="https://x.com/twistzz_eth"
          target="_blank"
          rel="noopener noreferrer"
          className="btn followBtn"
        >
          Follow on Twitter
        </a>
      </div>

      {mintStatus?.status === 'pending' && (
        <p className="pending">
          Tx pending…{' '}
          <a
            href={`https://testnet.monadexplorer.com/tx/${mintStatus.tx}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            view
          </a>
        </p>
      )}
      {mintStatus?.status === 'success' && (
        <p className="success">✅ Mint successful!</p>
      )}
      {mintStatus?.status === 'error' && (
        <p className="error">❌ {mintStatus.msg}</p>
      )}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 3rem auto;
          padding: 1rem;
          text-align: center;
          font-family: 'Lato', sans-serif;
        }
        .btn {
          cursor: pointer;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .connectBtn {
          margin-bottom: 1rem;
          padding: 0.6rem 1.2rem;
          background: linear-gradient(45deg, #8e44ad, #c39bd3);
          color: #fff;
        }
        .title {
          font-size: 2.25rem;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #8e44ad, #c39bd3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .aboutAuthor {
          margin-bottom: 1.5rem;
        }
        .aboutAuthor h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .aboutAuthor p {
          color: #555;
        }
        .imageBlock {
          background: #fff;
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
        .artImage {
          width: 100%;
          border-radius: 12px;
        }
        .phrase {
          margin: 0.75rem 0 0.25rem;
          color: #555;
          font-size: 1.1rem;
        }
        .supply {
          margin: 0.25rem 0 1rem;
          font-weight: bold;
          color: #333;
        }
        .btnRow {
          display: flex;
          justify-content: center;
          gap: 1.2rem;
          margin-bottom: 1.2rem;
        }
        .mintBtn,
        .nextBtn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #8e44ad, #c39bd3);
          color: #fff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        .mintBtn:disabled,
        .nextBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .mintBtn:hover:not(:disabled),
        .nextBtn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
        .followRow {
          margin-bottom: 1.5rem;
        }
        .followBtn {
          padding: 0.6rem 1.2rem;
          background: linear-gradient(45deg, #8e44ad, #c39bd3);
          color: #fff;
          text-decoration: none;
        }
        .pending {
          color: #d35400;
          margin-top: 0.5rem;
        }
        .success {
          color: #27ae60;
          margin-top: 0.5rem;
        }
        .error {
          color: #c0392b;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}