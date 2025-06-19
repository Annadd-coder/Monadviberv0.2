// pages/collections/[authorId].js  – v2 (fix chain-switch & sold-out counter)

import { useRouter } from 'next/router';
import {
  useContext, useState,
  useEffect, useCallback,
  useMemo
} from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { gql } from 'graphql-request';
import { graphClient } from '../../lib/client';
import contractJSON from '../../src/abi/MVB.json';
import { WalletContext } from '../_app';

const CHAIN_ID_DEC  = 10143;
const CHAIN_ID_HEX  = '0x279f';
const RPC_URL       = 'https://testnet-rpc.monad.xyz';
const CONTRACT      = '0xcD9e480b7A66128eDf5f935810681CbD6E8461f0';
const MAX_SUPPLY    = 100;
const IPFS_GATEWAY  = 'https://gateway.pinata.cloud/ipfs';

/** Автор → { count, cid, collectionId, link } */
export const REGISTRY = {
  twistzz:        { count: 12, cid: 'bafybeif2hdabepr5je2vblwi6iivwhzne3rwmql7qhwgcn3cwhpgqqzyv4', collectionId: 2,  link: 'https://x.com/twistzz_eth?s=21' },
  tchan4323:      { count: 10, cid: 'bafybeiff2kxd43msni7hwzycq26b45ned5b5yeuzb5xz4gfiw7jp7ma3xq', collectionId: 3,  link: 'https://x.com/TChamp234?s=09' },
  solncestoyanie: { count: 10, cid: 'bafybeidnib5rcvipty6hy4p6wwvrc7ul37wz7alsdlebvefbh7fpjkfmce', collectionId: 4,  link: 'https://x.com/solncestoyaniee' },
  Richard:        { count: 10, cid: 'bafybeiao64ba6ipurjijmga6e4hyrlsmki2bkkqxqxhx7j6uturpjpts3m', collectionId: 5,  link: 'https://x.com/starb0ba_fett?s=21' },
  miss_port:      { count: 10, cid: 'bafybeianlconikn7cv6ywphrewlbjfpvvj7uxi4sjwlryu7p22v7dvg4re', collectionId: 7,  link: 'https://x.com/kicklee89?s=21' },
  lzlzlz:         { count: 10, cid: 'bafybeidb3kcti7jkbv33pgqpci5l3hd7usgjlxhdzvpvktn7ha7avurp7e', collectionId: 8,  link: 'https://twitter.com/velicko_aleksej' },
  kasyak:         { count: 10, cid: 'bafybeidp6q3qkg5e3sdxrpmkwqjt3zu6m5qs2kioeeq336g7gxvqdtwjuu', collectionId: 9,  link: 'https://x.com/kasyak0?s=21' },
  Ishan:          { count: 10, cid: 'bafybeibspj7jah6wikgfmgxc5bmcxvxtgycqepf4zzx75c7mdp4p6vojne', collectionId: 10, link: 'https://x.com/ihsan00333?s=21' },
  ghooolyache:    { count: 10, cid: 'bafybeicgcphm5r3zoogtod5teypm7olodg5akpvre534edjtixex27wyha', collectionId: 11, link: 'https://x.com/ghooolyache' },
  gabriel:        { count: 10, cid: 'bafybeidx3u73jxyik5wcuyvxx24xbmpyqqi35yblytcapttlmupoc23pju', collectionId: 12, link: 'https://x.com/sekret_off' },
  Dohobob:        { count: 10, cid: 'bafybeieaxng266fbs4s4sdaazuf7czhmat4i6skyudx2d44xnrclbgbai4', collectionId: 13, link: 'https://x.com/dohobobmonad?s=21' },
  DayzZzer:       { count: 10, cid: 'bafybeico6ircxzelf3gsd6wd22hl3gasuclosh5mkkb2eauhko3uqh7hxa', collectionId: 14, link: 'https://x.com/dayzer__?s=21' },
  bromaxo:        { count: 10, cid: 'bafybeidkhpcpckelugdjluv4tsnlj7edcb64j2kkm3dbdjakwaz3mp275u', collectionId: 16, link: 'https://x.com/bro_maxo' },
  Antgeo:         { count: 10, cid: 'bafybeibylnlnfj7eip4m4l5tskyjzv2xjf7jr4wocjrapeskyph4ybakzq', collectionId: 18, link: 'https://x.com/antgeo13?s=21' },
};

const DEFAULT_PHRASES = [
  'Creativity unleashed!',
  'Feel the Monad vibes!',
  'Art beyond limits!',
  'Inspiration strikes!',
  'Colors of imagination!',
];

const GET_COLLECTION = gql`
  query GetCollection($id: ID!) {
    collection(id: $id) {
      currentSupply
    }
  }
`;

export default function AuthorPage() {
  const { query, isReady } = useRouter();
  const authorId = query.authorId;
  const { address, setAddress } = useContext(WalletContext);

  const [provider, setProvider]     = useState(null);
  const [currentArt, setCurrentArt] = useState('');
  const [phrase, setPhrase]         = useState('');
  const [isMinting, setIsMinting]   = useState(false);
  const [mintStatus, setMintStatus] = useState(null);

  const [currentSupply, setCurrentSupply] = useState(null);
  const [supplyError, setSupplyError]     = useState(null);

  /* 1) создаём ethers provider */
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  /* 2) meta по authorId */
  const meta = useMemo(() => {
    if (!isReady || !authorId) return null;
    const cfg = REGISTRY[authorId];
    if (!cfg) return null;
    return {
      artworks: Array.from({ length: cfg.count },
        (_, i) => `${IPFS_GATEWAY}/${cfg.cid}/art${i + 1}.png`
      ),
      phrases:      DEFAULT_PHRASES,
      collectionId: cfg.collectionId,
      link:         cfg.link ?? null,
    };
  }, [isReady, authorId]);

  /* 3) подгружаем currentSupply */
  useEffect(() => {
    if (!meta) return;
    setSupplyError(null);
    setCurrentSupply(null);

    graphClient
      .request(GET_COLLECTION, { id: String(meta.collectionId) })
      .then(res => setCurrentSupply(Number(res.collection.currentSupply)))
      .catch(err => {
        console.error(err);
        setSupplyError(err.message);
      });
  }, [meta]);

  /* 4) рандом арт + фраза */
  const pickRandom = useCallback(() => {
    if (!meta) return;
    const i = Math.floor(Math.random() * meta.artworks.length);
    setCurrentArt(meta.artworks[i]);
    setPhrase(
      meta.phrases[Math.floor(Math.random() * meta.phrases.length)]
    );
  }, [meta]);

  useEffect(() => { if (meta) pickRandom(); }, [meta, pickRandom]);

  /* 5) подключаем кошелёк */
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const [acc] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    setAddress(acc);
  }, [setAddress]);

  /* helper: ensure Monad Testnet */
  const ensureMonadTestnet = async () => {
    try {
      /* пытаемся сразу переключиться */
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch (switchError) {
      /* 4902 — сеть ещё не добавлена */
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: CHAIN_ID_HEX,
            chainName: 'Monad Testnet',
            rpcUrls: [RPC_URL],
            nativeCurrency: { name: 'Monad', symbol: 'MDA', decimals: 18 },
            blockExplorerUrls: ['https://testnet.monadexplorer.com'],
          }],
        });
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID_HEX }],
        });
      } else {
        throw switchError;
      }
    }
  };

  /* 6) Mint NFT */
  const mintNFT = useCallback(async () => {
    if (!provider) return alert('MetaMask not found');
    if (!address)  return alert('Connect wallet first');
    if (!meta)     return;

    setIsMinting(true);
    setMintStatus(null);

    try {
      await ensureMonadTestnet();

      const signer = await provider.getSigner();
      const ctr    = new ethers.Contract(CONTRACT, contractJSON.abi, signer);

      const tx = await ctr.mint(meta.collectionId, {
        value: ethers.parseEther('0.1'),
      });
      setMintStatus({ status: 'pending', tx: tx.hash });
      await tx.wait();

      const res = await graphClient.request(
        GET_COLLECTION, { id: String(meta.collectionId) }
      );
      setCurrentSupply(Number(res.collection.currentSupply));

      setMintStatus({ status: 'success', tx: tx.hash });
    } catch (e) {
      console.error(e);
      const reason = e?.reason || e?.message || '';
      if (e.code === -32002) {
        alert('Please check MetaMask — pending request');
      }
      setMintStatus({ status: 'error', msg: reason });
    } finally {
      setIsMinting(false);
    }
  }, [provider, address, meta]);

  /* 7) Рендер */
  if (!meta) {
    return isReady
      ? <p style={{ textAlign:'center', marginTop:'4rem' }}>Author not found</p>
      : <p>Loading…</p>;
  }

  const remaining = currentSupply !== null ? MAX_SUPPLY - currentSupply : null;
  const soldOut   = remaining === 0;

  return (
    <div className="container">
      {!address && (
        <button className="btn connectBtn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      <h1 className="title gradientText">{authorId}</h1>

      <section className="aboutAuthor">
        <h2>Support the artist</h2>
        <p>Show some love on Monad Testnet!</p>
      </section>

      <div className="imageCard">
        <img src={currentArt} className="artImage" alt="Artwork" />
      </div>

      <p className="phrase">{phrase}</p>

      <p className="supply">
        Minted&nbsp;<strong>{supplyError ? 'Error' : (currentSupply ?? '…')}</strong>&nbsp;/ {MAX_SUPPLY}
      </p>
      {remaining !== null && (
        <p className="remaining">
          {soldOut ? 'Sold out 🎉' : `Remaining ${remaining}`}
        </p>
      )}

      <div className="btnRow">
        <motion.button
          className="btn mintBtn"
          onClick={mintNFT}
          disabled={isMinting || !address || soldOut}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {soldOut ? 'Sold out' : (isMinting ? 'Minting…' : 'Mint')}
        </motion.button>

        <motion.button
          className="btn nextBtn"
          onClick={pickRandom}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>

        {meta.link && (
          <motion.a
            href={meta.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn followBtn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Follow
          </motion.a>
        )}
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
          max-width: 480px;
          margin: 2rem auto;
          padding: 1rem;
          text-align: center;
          font-family: 'Lato', sans-serif;
        }
        .gradientText {
          background: linear-gradient(45deg,#8e44ad,#3498db);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .aboutAuthor h2 {
          margin-bottom: 0.25rem;
        }
        .imageCard {
          margin: 0 auto 1rem;
          max-width: 360px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          overflow: hidden;
        }
        .artImage {
          width: 100%;
          height: auto;
          display: block;
        }
        .btnRow {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin: 1.25rem 0;
        }
        .btn {
          padding: 0.75rem 1.6rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          background: linear-gradient(45deg,#8e44ad,#c39bd3);
          color: #fff;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .followBtn {
          background: linear-gradient(45deg,#1da1f2,#0d8de1);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn:hover {
          box-shadow: 0 6px 22px rgba(0,0,0,0.18);
        }
        .phrase { font-style: italic; color: #555; margin-bottom: 0.5rem; }
        .supply { margin: .5rem 0; font-weight: bold; }
        .remaining { margin-top: -0.25rem; color: #777; font-size: 0.9rem; }
        .pending { color: #d35400; }
        .success { color: #27ae60; }
        .error   { color: #c0392b; }
      `}</style>
    </div>
  );
}