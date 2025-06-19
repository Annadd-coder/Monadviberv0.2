import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { supabase } from '../lib/supabaseClient';
import { WalletContext } from './_app';

export default function Profile() {
  const router               = useRouter();
  const { address: ctxAddr } = useContext(WalletContext);

  const [wallet, setWallet]   = useState(null);
  const [moaps,  setMoaps]    = useState([]);
  const [collections, setColl]= useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab]         = useState('moaps');

  /* detect wallet */
  useEffect(() => {
    const w = (router.query.address || ctxAddr || '').toString();
    setWallet(w || null);
  }, [router.query.address, ctxAddr]);

  /* fetch MOAPs */
  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    (async () => {
      try {
        const { data: claims, error } = await supabase
          .from('moap_claims')
          .select('moap_id')
          .ilike('wallet', wallet);
        if (error) throw error;

        const ids = claims.map(r => r.moap_id);
        if (!ids.length) { setMoaps([]); return; }

        const { data, error: err2 } = await supabase
          .from('moaps')
          .select('id, description, image_url')
          .in('id', ids);
        if (err2) throw err2;

        setMoaps(data.map(m => ({
          id: m.id,
          description: m.description || `MOAP #${m.id}`,
          image: m.image_url || '/placeholder.png',
        })));
      } catch (e) {
        toast.error(`MOAP load failed: ${e.message ?? e}`);
      } finally { setLoading(false); }
    })();
  }, [wallet]);

  /* total collections */
  useEffect(() => {
    (async () => {
      const { count } = await supabase
        .from('collections')
        .select('*', { head:true, count:'exact' });
      setColl(count || 0);
    })();
  }, []);

  if (!wallet) return <Center>Connect wallet to view dashboard.</Center>;

  /* share url */
  const shareUrl = (it) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || '';
    const txt = `Just claimed a MOAP for the \"${it.description}\" event on MonadViber pre-test!`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(`${origin}/share/moap/${it.id}`)}`;
  };

  /* ---------------- render ---------------- */
  return (
    <div className="wrap">
      <h1 className="h1">My Dashboard</h1>

      <section className="stats">
        <Stat num={moaps.length} label="MOAPs" />
        <Stat num={0}            label="NFTs"  />
        <Stat num={collections}  label="Collections" />
      </section>

      <div className="tabs">
        {['moaps','nfts','quests'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={tab===t?'act':''}>{t.toUpperCase()}</button>
        ))}
      </div>

      {loading && <p className="info">Loading…</p>}
      {tab==='moaps' && !loading && (
        moaps.length ? <Grid list={moaps} build={shareUrl}/> : <p className="info">No MOAPs yet.</p>
      )}
      {tab==='nfts'   && <p className="info">NFT section coming soon</p>}
      {tab==='quests' && <p className="info">Quest system coming soon</p>}

      <style jsx>{`
        .wrap{min-height:100vh;padding:60px 20px;background:linear-gradient(135deg,#f8f4ff,#e1bee7);font-family:Lato,sans-serif;}
        .h1{text-align:center;font-size:2.6rem;font-weight:700;color:#6a1b9a;margin-bottom:2rem;}
        .stats{display:flex;justify-content:center;gap:2.5rem;margin-bottom:1rem;flex-wrap:wrap;}
        .tabs{display:flex;justify-content:center;gap:1rem;margin-bottom:1.4rem;flex-wrap:wrap;}
        .tabs button{padding:8px 18px;border:none;border-radius:8px;background:#eee;color:#555;font-weight:600;cursor:pointer;transition:.2s;}
        .tabs button:hover{background:#ddd;}
        .tabs .act{background:#6a1b9a;color:#fff;}
        .info{text-align:center;color:#666;margin-top:1.4rem;}
      `}</style>
    </div>
  );
}

/* ---------- helpers ---------- */
const Stat = ({ num,label }) => (
  <div className="stat">
    <strong>{num}</strong><span>{label}</span>
    <style jsx>{`
      .stat{text-align:center;}
      strong{display:block;font-size:2.2rem;color:#333;}
      span{font-size:0.9rem;color:#555;}
    `}</style>
  </div>
);

const Grid = ({ list, build }) => (
  <>
    <div className="grid">
      {list.map(it=>(
        <div key={it.id} className="card">
          <div className="circle"><img src={it.image} alt={it.description}/></div>
          <p className="desc" title={it.description}>{it.description}</p>
          <Link href={build(it)} target="_blank" className="btn">Share ↗</Link>
        </div>
      ))}
    </div>
    <style jsx>{`
      .grid{display:flex;flex-wrap:wrap;justify-content:center;gap:46px;}
      .card{width:200px;display:flex;flex-direction:column;align-items:center;}
      .circle{width:160px;height:160px;border-radius:50%;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.12);transition:transform .2s;}
      .card:hover .circle{transform:translateY(-4px);}
      .circle img{width:100%;height:100%;object-fit:cover;}
      .desc{margin:14px 0 10px;font-weight:600;color:#333;text-align:center;}
      .btn{padding:10px 28px;border:none;border-radius:24px;background:linear-gradient(135deg,#7b1fa2,#b053d3);color:#fff;font-weight:700;text-decoration:none;transition:transform .2s,box-shadow .2s;}
      .btn:hover{transform:translateY(-3px);box-shadow:0 8px 16px rgba(0,0,0,.18);}
    `}</style>
  </>
);

const Center = ({children}) => (
  <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Lato,sans-serif'}}>{children}</div>
);
