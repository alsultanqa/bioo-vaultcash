'use client';
import { useState } from 'react';

export default function Links(){
  const [amount, setAmount] = useState(1500); // in minor units
  const [orderId, setOrderId] = useState('ORD-1001');
  const [resp, setResp] = useState<any>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  const create = async () => {
    const r = await fetch(base + '/api/payment-links', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ amount, currency: 'QAR', orderId })
    });
    setResp(await r.json());
  };

  return (
    <main style={{padding: 24}}>
      <h1>Payment Links & EMV‑QR</h1>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <label>Amount (dirhams)</label>
        <input type="number" value={amount} onChange={e=>setAmount(parseInt(e.target.value||'0'))} />
        <input value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="orderId" />
        <button onClick={create}>Create Link</button>
      </div>
      {resp && <section style={{marginTop: 24}}>
        <p><b>Link:</b> <a href={resp.linkUrl} target="_blank" rel="noreferrer">{resp.linkUrl}</a></p>
        <p><b>EMV Payload:</b></p>
        <pre style={{whiteSpace:'pre-wrap', wordBreak:'break-all'}}>{resp.emv}</pre>
        {resp.qrPngDataUrl && <img src={resp.qrPngDataUrl} alt="QR" style={{maxWidth: 240}} />}
      </section>}
    </main>
  );
}
