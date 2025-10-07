'use client';
import { useState } from 'react';
import { api } from '../../../lib/api';
export default function NewLink(){
  const [orderId,setOrderId]=useState('ORD-1001');
  const [amount,setAmount]=useState(1500);
  const [currency,setCurrency]=useState('QAR');
  const [result,setResult]=useState<any>(null);
  async function submit(e:any){
    e.preventDefault();
    const j = await api('/api/payment-links', { method:'POST', body: JSON.stringify({ amount:Number(amount), currency, orderId }) });
    setResult(j);
  }
  return (
    <form onSubmit={submit}>
      <h3>رابط دفع جديد</h3>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
        <input className="input" value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="Order ID" />
        <input className="input" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} placeholder="Amount (dirhams)" />
        <input className="input" value={currency} onChange={e=>setCurrency(e.target.value)} placeholder="QAR" />
      </div>
      <button className="btn" style={{marginTop:12}}>إنشاء</button>
      {result && (<div className="card" style={{marginTop:12}}>
        <div>token: {result.token}</div>
        <div>paymentId: {result.paymentId}</div>
        <div>checkoutUrl: <a href={result.checkoutUrl} target="_blank">{result.checkoutUrl}</a></div>
      </div>)}
    </form>
  );
}
