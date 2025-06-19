import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { ethers, isAddress } from 'ethers';
import toast from 'react-hot-toast';

import { supabase } from '../../lib/supabaseClient';
import MOAP_ABI      from '../../src/abi/MOAP.json';
import { WalletContext } from '../_app';

/* адрес контракта */
const MOAP_ADDR = '0x46C4022fc2754f4Be0561F084c4746E453AF8Cd5';
if (!isAddress(MOAP_ADDR))
  toast.error('MOAP address in code is not a valid 0x-address');

export default function MoapsPage() {
  const { signer }          = useContext(WalletContext);
  const [rows, setRows]     = useState([]);
  const [busyId, setBusyId] = useState(null);

  /* 1. список всех MOAP-ов */
  useEffect(() => {
    supabase.from('moaps')
      .select('*')
      .order('created_at', { ascending:false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setRows(data ?? []);
      });
  }, []);

  /* 2. минт */
  async function handleMint(row) {
    if (!signer) return toast.error('Connect wallet first');

    try {
      /* ── проверка кода, если приватный ── */
      if (row.is_private) {
        const code = prompt('Enter access code')?.trim().toLowerCase();
        if (!code) return;
        const ok = await fetch('/api/verify', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ hash: row.access_code_hash, code }),
        }).then(r => r.json());
        if (!ok) return toast.error('Wrong code');
      }

      /* ── минтим ── */
      setBusyId(row.id);
      const ctr = new ethers.Contract(MOAP_ADDR, MOAP_ABI.abi, signer);
      const tx  = await ctr.claimMOAP(row.id);
      await tx.wait();

      /* 2-a. заносим минт в Supabase (для дашборда) */
      try {
        await supabase.from('moap_claims').insert({
          wallet : await signer.getAddress(),
          moap_id: row.id
        });
      } catch (dbErr) {
        console.error('Log mint error', dbErr);
      }

      toast.success('MOAP claimed!');
      setRows(prev => prev.map(r =>
        r.id === row.id
          ? { ...r, current_claims: r.current_claims + 1 }
          : r
      ));
    } catch (e) {
      toast.error(e.reason ?? e.message);
    } finally {
      setBusyId(null);
    }
  }

  /* 3. UI */
  return (
    <div style={s.bg}>
      <h1 style={s.title}>MOAP Section</h1>
      <p style={s.subtitle}>
        Here you can mint MOAP tokens for participation in events on Monad.<br/>
        MOAPs are your proof-of-attendance showing you were truly there.
      </p>

      <div style={s.list}>
        {rows.length === 0
          ? <p style={s.info}>No MOAPs found.</p>
          : rows.map(r => (
              <div key={r.id} style={s.card}>
                <img src={r.image_url}
                     alt={r.description || `MOAP #${r.id}`}
                     style={s.img}/>
                <p style={s.cardTitle}>
                  {r.description?.trim() ? r.description : `MOAP #${r.id}`}
                </p>
                <p style={s.claims}>
                  {r.current_claims}/{r.max_claims} claimed
                  {r.is_private && ' · 🔒'}
                </p>
                <button
                  disabled={busyId === r.id || r.current_claims >= r.max_claims}
                  onClick={() => handleMint(r)}
                  style={{
                    ...s.mintBtn,
                    opacity: r.current_claims >= r.max_claims ? .6 : 1,
                  }}>
                  {busyId === r.id
                    ? 'Minting…'
                    : r.current_claims >= r.max_claims
                      ? 'Sold out'
                      : 'Mint MOAP'}
                </button>
              </div>
            ))}
      </div>

      <div style={s.createSect}>
        <Link href="/moaps/create">
          <button style={s.createBtn}>Create MOAP for Your Event</button>
        </Link>
      </div>
    </div>
  );
}

/* стили */
const s = {
  bg:{ minHeight:'100vh',padding:'80px 20px',
       background:'linear-gradient(135deg,#FFFFFF,#E1BEE7)' },
  title:{ textAlign:'center',fontSize:'2.4rem',fontWeight:700,
          color:'#6A1B9A',marginBottom:14 },
  subtitle:{ textAlign:'center',maxWidth:660,margin:'0 auto 50px',
             fontSize:'1.05rem',lineHeight:1.55,color:'#444' },
  list:{ display:'flex',flexWrap:'wrap',justifyContent:'center',gap:26 },
  card:{ width:240,background:'#fff',borderRadius:14,
         boxShadow:'0 8px 24px rgba(0,0,0,.1)' },
  img:{ width:'100%',height:150,objectFit:'cover',
        borderRadius:'14px 14px 0 0' },
  cardTitle:{ fontSize:'1.05rem',fontWeight:600,color:'#333',
              margin:12,lineHeight:1.3,minHeight:44,display:'flex',
              alignItems:'center' },
  claims:{ fontSize:'.85rem',color:'#555',margin:'0 12px 16px' },
  mintBtn:{ width:'calc(100% - 24px)',margin:'0 12px 18px',padding:'10px 0',
            background:'#6A1B9A',color:'#fff',fontWeight:700,border:'none',
            borderRadius:8,cursor:'pointer',transition:'background .2s' },
  createSect:{ marginTop:60,textAlign:'center' },
  createBtn:{ padding:'14px 32px',fontSize:'1rem',fontWeight:700,
              background:'#6A1B9A',color:'#fff',border:'none',
              borderRadius:8,cursor:'pointer',transition:'background .2s' },
  info:{ fontSize:'1.2rem',color:'#555' },
};