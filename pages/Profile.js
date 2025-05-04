// pages/Profile.js – clean investor‑friendly cabinet (NFT gallery, no auction)
import { useRouter } from 'next/router';
import { useEffect, useState, useContext, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from './_app';
import contractABI from '../src/abi/MVB.json';

const CONTRACT_ADDRESS = '0xcD9e480b7A66128eDf5f935810681CbD6E8461f0';
const MONAD_CHAIN_ID = 10143n; // BigInt

export default function Profile() {
  const router = useRouter();
  const { address: contextAddr } = useContext(WalletContext);

  /*  Core state  */
  const [profileAddress, setProfileAddress] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ----------------------------------- */
  /*   Determine which address to show   */
  /* ----------------------------------- */
  useEffect(() => {
    const addr = router.query.address || contextAddr || null;
    setProfileAddress(addr);
  }, [router.query.address, contextAddr]);

  /* ----------------------------------- */
  /*    Ensure MetaMask & right network   */
  /* ----------------------------------- */
  const getProviderOnMonad = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) throw new Error('MetaMask not found');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const net = await provider.getNetwork();
    if (net.chainId !== MONAD_CHAIN_ID) {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }] });
    }
    return provider;
  }, []);

  /* ----------------------------------- */
  /*            Fetch user NFTs           */
  /* ----------------------------------- */
  const fetchNFTs = useCallback(async () => {
    if (!profileAddress) return;
    try {
      setLoading(true);
      setError(null);
      const provider = await getProviderOnMonad();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, provider);

      const bal = await contract.balanceOf(profileAddress);
      const total = Number(bal);
      if (!total) return setNfts([]);

      // robustly fetch tokenIds even if enumeration glitches
      const tokenIds = [];
      for (let i = 0; i < total; i++) {
        try {
          const tid = await contract.tokenOfOwnerByIndex(profileAddress, i);
          tokenIds.push(tid);
        } catch (e) {
          // Occasionally index > balance due to race‑condition → stop
          console.warn('tokenOfOwnerByIndex revert at', i, e.reason || e);
          break;
        }
      }

      const meta = await Promise.all(tokenIds.map(async (tid) => {
        try {
          let uri = await contract.tokenURI(tid);
          if (uri.startsWith('ipfs://')) uri = uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          const res = await fetch(uri);
          if (!res.ok) throw new Error('meta fetch fail');
          const json = await res.json();
          let img = json.image || '';
          if (img.startsWith('ipfs://')) img = img.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          return { tokenId: Number(tid), name: json.name ?? `NFT #${tid}`, description: json.description ?? '', image: img };
        } catch (e) { console.error(e); return null; }
      }));

      setNfts(meta.filter(Boolean));
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally { setLoading(false); }
  }, [profileAddress, getProviderOnMonad]);

  /* initial fetch */
  useEffect(() => { fetchNFTs(); }, [fetchNFTs]);

  if (!profileAddress) {
    return (
      <div className="wrapper"><p className="info">Connect wallet to view your profile.</p></div>
    );
  }

  return (
    <div className="wrapper">
      <div className="hero">
        <h1>Welcome to your Collection</h1>
        <p className="addr">{profileAddress}</p>
        <p className="sub">Total NFTs minted: <strong>{nfts.length}</strong></p>
      </div>

      {/* NFT grid */}
      <section className="gallery">
        {loading ? <p className="info">Loading…</p> : error ? <p className="error">{error}</p> : nfts.length === 0 ? <p className="info">You don’t own any NFTs yet.</p> : (
          <div className="grid">
            {nfts.map((nft) => (
              <figure key={nft.tokenId} className="card">
                <img src={nft.image} alt={nft.name} />
                <figcaption>
                  <span>{nft.name}</span>
                  <small>#{nft.tokenId}</small>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .wrapper{
          min-height:100vh; padding:80px 24px 60px; background:linear-gradient(135deg,#ECE1F9 0%,#F8F4FD 100%);
          color:#4A148C; font-family:"Poppins",sans-serif;
        }
        .hero{ text-align:center; margin-bottom:40px; }
        .hero h1{ font-size:2.6rem; margin:0; }
        .addr{ font-family:monospace; font-size:0.95rem; opacity:.8; }
        .sub{ margin-top:8px; font-weight:500; }

        .gallery{ max-width:1100px; margin:0 auto; }
        .grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:24px; }

        .card{ background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 6px 28px rgba(0,0,0,.12); transition:transform .25s; }
        .card:hover{ transform:translateY(-4px); }
        .card img{ width:100%; height:260px; object-fit:cover; }
        figcaption{ padding:12px 16px; display:flex; justify-content:space-between; align-items:center; }
        figcaption span{ font-weight:600; }
        figcaption small{ color:#8E24AA; }

        .info{ text-align:center; font-style:italic; }
        .error{ text-align:center; color:#D50000; }

        @media(max-width:768px){
          .hero h1{ font-size:2rem; }
          .card img{ height:200px; }
        }
      `}</style>
    </div>
  );
}
