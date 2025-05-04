import { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiHeart, FiMessageSquare, FiX } from 'react-icons/fi';
import { WalletContext } from './_app';
import contractABI from '../src/abi/MVB.json';
import { supabase } from '../lib/supabaseClient';

// Registry of authors and collection IDs
const REGISTRY = {
  twistzz: { count: 12, collectionId: 2 },
  tchan4323: { count: 10, collectionId: 3 },
  solncestoyanie: { count: 15, collectionId: 4 },
  Richard: { count: 15, collectionId: 5 },
  N1nja: { count: 15, collectionId: 6 },
  miss_port: { count: 15, collectionId: 7 },
  lzlzlz: { count: 15, collectionId: 8 },
  kasyak: { count: 15, collectionId: 9 },
  Ishan: { count: 15, collectionId: 10 },
  ghooolyache: { count: 15, collectionId: 11 },
  gabriel: { count: 15, collectionId: 12 },
  Dohobob: { count: 15, collectionId: 13 },
  DayzZzer: { count: 15, collectionId: 14 },
  daha: { count: 15, collectionId: 15 },
  bromaxo: { count: 15, collectionId: 16 },
  Avader: { count: 15, collectionId: 17 },
  Antgeo: { count: 15, collectionId: 18 },
  AnnaD: { count: 15, collectionId: 19 },
  Akela: { count: 15, collectionId: 20 },
};
const CONTRACT_ADDRESS = '0xcD9e480b7A66128eDf5f935810681CbD6E8461f0';
const MONAD_CHAIN_ID = 10143n;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Feed() {
  const { address } = useContext(WalletContext);
  const [likesMap, setLikesMap] = useState({});
  const [userLikes, setUserLikes] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [openCommentId, setOpenCommentId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [inputAuthor, setInputAuthor] = useState('');
  const [mintingId, setMintingId] = useState(null);

  // Prepare shuffled posts
  const posts = useMemo(() => {
    const all = Object.entries(REGISTRY).flatMap(([authorId, { count, collectionId }]) =>
      Array.from({ length: count }, (_, i) => ({
        id: `${authorId}-${i}`,
        authorId,
        collectionId,
        image: `/collections/${authorId}/art${i + 1}.png`,
      }))
    );
    return shuffleArray(all);
  }, []);

  // Initial load of likes & comments
  useEffect(() => {
    supabase
      .from('likes')
      .select('post_id, likes')
      .then(({ data }) => data && setLikesMap(Object.fromEntries(data.map(r => [r.post_id, r.likes]))));
    if (address) {
      supabase
        .from('user_likes')
        .select('post_id')
        .eq('user_address', address)
        .then(({ data }) => data && setUserLikes(data.map(r => r.post_id)));
    }
    supabase
      .from('comments')
      .select('post_id, author, text, created_at')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) {
          const grouped = data.reduce((acc, c) => { (acc[c.post_id] ||= []).push(c); return acc; }, {});
          setCommentsMap(grouped);
        }
      });
  }, [address]);

  // Like handler
  const handleLike = async (postId) => {
    if (!address || userLikes.includes(postId)) return;
    await supabase.from('user_likes').insert([{ post_id: postId, user_address: address }]);
    await supabase.rpc('increment_post_like', { post_input: postId });
    setUserLikes(prev => [...prev, postId]);
    setLikesMap(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
  };

  // Submit comment (with immediate UI update)
  const handleCommentSubmit = async () => {
    const postId = openCommentId;
    const author = inputAuthor.trim();
    const text = inputText.trim();
    if (!author || !text) return;
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, author, text }]);
    if (!error) {
      // Clear inputs
      setInputAuthor('');
      setInputText('');
      // Refetch this post's comments
      const { data: fresh } = await supabase
        .from('comments')
        .select('post_id, author, text, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      setCommentsMap(prev => ({ ...prev, [postId]: fresh }));
    }
  };

  // Mint handler
  const handleMint = useCallback(async (post) => {
    if (mintingId) return;
    if (!address) return alert('Connect wallet');
    if (!window.ethereum) return alert('Install MetaMask');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const net = await provider.getNetwork();
      if (net.chainId !== MONAD_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${MONAD_CHAIN_ID.toString(16)}` }],
        });
      }
      const signer = await provider.getSigner();
      const ctr = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      const tx = await ctr.mint(post.collectionId, { value: ethers.parseEther('0.1') });
      setMintingId(post.id);
      await tx.wait();
      alert('Mint successful!');
    } catch (e) {
      console.error(e);
      alert(e?.message || 'Mint failed');
    } finally {
      setMintingId(null);
    }
  }, [address, mintingId]);

  return (
    <div className="wrapper">
      {!address && <div className="banner">Connect wallet to like, comment & mint</div>}

      <div className="scroller">
        {posts.map(post => (
          <div key={post.id} className="slide">
            <motion.img
              src={post.image}
              alt={`${post.authorId} artwork`}
              className="art"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            <div className="controls">
              <button
                className="iconBtn"
                onClick={() => handleLike(post.id)}
                disabled={!address || userLikes.includes(post.id)}
              >
                <FiHeart size={24} />
                <span className="count">{likesMap[post.id] || 0}</span>
              </button>
              <button
                className="iconBtn"
                onClick={() => setOpenCommentId(post.id)}
              >
                <FiMessageSquare size={24} />
              </button>
              <button
                className="iconBtn"
                onClick={() => handleMint(post)}
                disabled={mintingId === post.id}
              >
                <FiPlusCircle size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar for comments */}
      {openCommentId && (
        <div className="commentSidebar">
          <div className="sidebarHeader">
            <h3>Comments</h3>
            <button className="closeBtn" onClick={() => setOpenCommentId(null)}>
              <FiX size={20} />
            </button>
          </div>

          <div className="commentsList">
            {(commentsMap[openCommentId] || []).map((c, i) => (
              <div key={i} className="commentItem">
                <strong>{c.author}</strong>
                <p>{c.text}</p>
                <time>{new Date(c.created_at).toLocaleString()}</time>
              </div>
            ))}
          </div>

          <div className="commentForm">
            <textarea
              placeholder="Your comment..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
            />
            <input
              type="text"
              placeholder="Your name"
              value={inputAuthor}
              onChange={e => setInputAuthor(e.target.value)}
            />
            <button className="sendBtn" onClick={handleCommentSubmit}>
              Send
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .wrapper {
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #f3e5f5, #e1bee7);
          position: relative;
        }
        .banner {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          color: #4a148c;
          padding: 10px 20px;
          border-radius: 20px;
          z-index: 10;
        }
        .scroller {
          height: 100%;
          overflow-y: auto;
          scroll-snap-type: y mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .scroller::-webkit-scrollbar {
          display: none;
        }
        .slide {
          height: 100vh;
          scroll-snap-align: start;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .art {
          max-width: 90vw;
          max-height: 60vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .controls {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 5;
        }
        .iconBtn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(45deg,#8e44ad,#c39bd3);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .iconBtn:hover {
          transform: scale(1.1);
        }
        .iconBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .count {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #e74c3c;
          color: #fff;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
        }
        /* Comments sidebar */
        .commentSidebar {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100vh;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(6px);
          box-shadow: -4px 0 24px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          padding: 16px;
          z-index: 20;
        }
        .sidebarHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .sidebarHeader h3 {
          margin: 0;
          color: #4a148c;
        }
        .closeBtn {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
        }
        .commentsList {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .commentItem {
          padding: 8px;
          background: #f9f0ff;
          border-radius: 8px;
        }
        .commentItem strong {
          display: block;
          color: #4a148c;
        }
        .commentItem p {
          margin: 4px 0;
        }
        .commentItem time {
          font-size: 0.75rem;
          color: #666;
        }
        .commentForm {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .commentForm textarea,
        .commentForm input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
        .sendBtn {
          background: #8e44ad;
          color: #fff;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}