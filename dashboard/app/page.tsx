'use client';
import { useState } from 'react';

export default function Home(){
  const [amount, setAmount] = useState(100);
  const [orderId, setOrderId] = useState('ORD-1');
  const [resp, setResp] = useState<any>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  const create = async () => {
    const r = await fetch(base + '/api/payments', { method: 'POST', headers: {'Content-Type':'application/json', 'Idempotency-Key': crypto.randomUUID()}, body: JSON.stringify({ amount, orderId }) });
    setResp(await r.json());
  };

  return (
    <main style={{padding: 24}}>
      <h1>QatarCash — Merchant Portal (MVP)</h1>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <input type="number" value={amount} onChange={e=>setAmount(parseInt(e.target.value||'0'))} />
        <input value={orderId} onChange={e=>setOrderId(e.target.value)} />
        <button onClick={create}>Create Payment</button>
      </div>
      <pre>{resp ? JSON.stringify(resp, null, 2) : '...'}</pre>
    </main>
  );
}


// Navigate to /links for Payment Links & EMV‑QR demo


// Admin pages: /admin/payments , /admin/reports
