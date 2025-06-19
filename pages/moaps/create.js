import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ethers, isAddress, keccak256, toUtf8Bytes } from 'ethers';
import toast from 'react-hot-toast';

import { supabase } from '../../lib/supabaseClient';
import MOAP_ABI      from '../../src/abi/MOAP.json';
import { WalletContext } from '../_app';

const MOAP_ADDR = '0x46C4022fc2754f4Be0561F084c4746E453AF8Cd5';
if (!isAddress(MOAP_ADDR)) throw new Error('MOAP_ADDR invalid');

export default function CreateMoap() {
  const router              = useRouter();
  const { address, signer } = useContext(WalletContext);

  const [file, setFile]         = useState(null);
  const [description, setDesc]  = useState('');
  const [maxClaims, setMax]     = useState(1);
  const [isPrivate, setPriv]    = useState(false);
  const [accessCode, setCode]   = useState('');
  const [busy, setBusy]         = useState(false);

  if (!address)
    return (
      <div style={st.center}>Please connect your wallet.</div>
    );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file)         return toast.error('Upload an image');
    if (maxClaims < 1) return toast.error('Max claims must be ≥ 1');

    try {
      setBusy(true);

      /* 1. Картинка → Supabase Storage */
      const path = `${Date.now()}_${file.name}`;
      const { error: upErr } = await supabase.storage
        .from('moap-images')
        .upload(path, file);
      if (upErr) throw upErr;

      const { data: { publicUrl } } =
        supabase.storage.from('moap-images').getPublicUrl(path);
      if (!publicUrl) throw new Error('Cannot get public URL');

      /* 2. Метаданные → /api/ipfs-upload (pin) */
      const ipfsRes = await fetch('/api/ipfs-upload', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          name : 'MOAP',
          description,
          image: publicUrl,
        }),
      });
      if (!ipfsRes.ok) throw new Error(await ipfsRes.text());
      const { cid } = await ipfsRes.json();
      if (!cid) throw new Error('IPFS upload failed');

      /* 3. createMOAP on-chain */
      const ctr = new ethers.Contract(MOAP_ADDR, MOAP_ABI.abi, signer);
      const tx  = await ctr.createMOAP(cid, ethers.toBigInt(maxClaims));
      const rc  = await tx.wait();

      /* получаем id из события */
      let id;
      try {
        const ev     = ctr.interface.getEvent('MoapCreated');
        const topic0 = ctr.interface.getEventTopic(ev);
        for (const log of rc.logs) {
          if (log.topics[0] !== topic0) continue;
          id = Number(
            ctr.interface.decodeEventLog(ev, log.data, log.topics)[0]
          );
          break;
        }
      } catch {/* ignore */}
      if (id === undefined)
        id = Number(await ctr.totalMOAPs());
      if (!id) throw new Error('Cannot determine MOAP id');

      /* 4. Хэш кода (если приватный) */
      const pwdHash = isPrivate
       ? keccak256(toUtf8Bytes(accessCode.trim().toLowerCase()))
       : null;
      /* 5. Запись в Supabase */
      const { error: dbErr } = await supabase.from('moaps').insert({
        id,
        ipfs_hash       : cid,
        description,
        image_url       : publicUrl,
        is_private      : isPrivate,
        access_code_hash: pwdHash,
        max_claims      : maxClaims,
        creator         : address,
        current_claims  : 0,
      });
      if (dbErr) throw dbErr;

      toast.success('MOAP created!');
      router.push('/moaps');
    } catch (err) {
      console.error(err);
      toast.error(err.message ?? 'Error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={st.page}>
      <h1 style={st.h1}>Create MOAP for Your Event</h1>

      <form style={st.card} onSubmit={handleSubmit}>
        <Group label="Upload event image:">
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files[0])}
            style={st.inputFile}
          />
        </Group>

        <Group label="Event description:">
          <textarea
            rows="4"
            value={description}
            onChange={e => setDesc(e.target.value)}
            style={st.textarea}
          />
        </Group>

        <Group label="Max number of claims:">
          <input
            type="number"
            min="1"
            value={maxClaims}
            onChange={e => setMax(Number(e.target.value))}
            style={st.input}
          />
        </Group>

        <div style={{ ...st.row, margin:'6px 0' }}>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={e => setPriv(e.target.checked)}
            id="priv"/>
          <label htmlFor="priv" style={{ marginLeft:8,fontWeight:600 }}>
            Private Event
          </label>
        </div>

        {isPrivate && (
          <Group label="Access Code:">
            <input
              type="text"
              value={accessCode}
              onChange={e => setCode(e.target.value)}
              style={st.input}
            />
          </Group>
        )}

        <button style={st.btn} disabled={busy}>
          {busy ? 'Creating…' : 'Create MOAP'}
        </button>
      </form>
    </div>
  );
}

/* helpers */
const Group = ({ label, children }) => (
  <div style={{ marginBottom:16, display:'flex',flexDirection:'column' }}>
    {label && <span style={st.label}>{label}</span>}
    {children}
  </div>
);

/* стили */
const st = {
  center:{ minHeight:'100vh',display:'flex',alignItems:'center',
           justifyContent:'center',background:'#f8f4ff',
           color:'#6a1b9a',fontSize:'1.3rem',fontWeight:600 },
  page  :{ minHeight:'100vh',padding:'60px 20px',
           background:'linear-gradient(135deg,#FFFFFF,#E1BEE7)' },
  h1    :{ textAlign:'center',fontSize:'2.2rem',fontWeight:700,
           color:'#6a1b9a',marginBottom:40 },
  card  :{ maxWidth:500,margin:'0 auto',background:'#fff',padding:28,
           borderRadius:12,boxShadow:'0 8px 24px rgba(0,0,0,.1)',
           display:'flex',flexDirection:'column' },
  label :{ marginBottom:6,fontWeight:600,color:'#6a1b9a' },
  input :{ border:'1px solid #ccc',borderRadius:6,padding:8,fontSize:'1rem' },
  inputFile:{ border:'1px solid #ccc',borderRadius:6,padding:6 },
  textarea:{ border:'1px solid #ccc',borderRadius:6,padding:8,
             fontSize:'1rem',resize:'vertical' },
  row   :{ display:'flex',alignItems:'center' },
  btn   :{ marginTop:4,padding:'12px 0',background:'#6a1b9a',color:'#fff',
           fontWeight:700,border:'none',borderRadius:8,cursor:'pointer' },
};