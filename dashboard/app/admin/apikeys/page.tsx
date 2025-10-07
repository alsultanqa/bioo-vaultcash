'use client';
import { useEffect, useState } from 'react';

type Key = { id:string; key:string; label?:string; environment:string; merchantId:string; createdAt:string };

export default function ApiKeys(){
  const [items, setItems] = useState<Key[]>([]);
  const [merchantId, setMerchantId] = useState('seed-merchant');
  const [env, setEnv] = useState<'test'|'live'>('test');
  const [label, setLabel] = useState('Key');

  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  async function load(){
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ location.href='/login'; return; }
    const r = await fetch(base + '/apikeys', { headers: { Authorization: 'Bearer '+jwt } });
    const j = await r.json(); setItems(j.items||[]);
  }
  useEffect(()=>{ load(); }, []);

  async function create(){
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ location.href='/login'; return; }
    const r = await fetch(base + '/apikeys', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+jwt }, body: JSON.stringify({ merchantId, environment: env, label }) });
    if(r.ok) load();
  }
  async function revoke(id:string){
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ location.href='/login'; return; }
    const r = await fetch(base + '/apikeys/'+id, { method:'DELETE', headers:{ Authorization:'Bearer '+jwt } });
    if(r.ok) load();
  }

  return (
    <main style={{padding:24}}>
      <h1>API Keys</h1>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:16}}>
        <input placeholder="merchantId" value={merchantId} onChange={e=>setMerchantId(e.target.value)} />
        <select value={env} onChange={e=>setEnv(e.target.value as any)}><option value="test">test</option><option value="live">live</option></select>
        <input placeholder="label" value={label} onChange={e=>setLabel(e.target.value)} />
        <button onClick={create}>Create</button>
      </div>

      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Key</th><th>Env</th><th>Label</th><th>Merchant</th><th>Created</th><th>Action</th></tr></thead>
        <tbody>
          {items.map(k => (
            <tr key={k.id} style={{borderTop:'1px solid #ddd'}}>
              <td style={{fontFamily:'monospace'}}>{k.key}</td>
              <td>{k.environment}</td>
              <td>{k.label||'—'}</td>
              <td>{k.merchantId}</td>
              <td>{new Date(k.createdAt).toLocaleString()}</td>
              <td><button onClick={()=>revoke(k.id)}>Revoke</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
