'use client';
import { useEffect, useState } from 'react';

export default function AdminPayments(){
  const [items, setItems] = useState<any[]>([]);
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  const load = async () => {
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ window.location.href='/login'; return; }
    const r = await fetch(base + '/admin/payment-links', { headers: { Authorization: 'Bearer ' + (localStorage.getItem('qc_jwt')||'') } });
    const j = await r.json();
    setItems(j.items || []);
  };
  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, []);

  return (
    <main style={{padding:24}}>
      <h1>Payments / Links</h1>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Order</th><th align="left">Payment</th><th align="left">Amount</th><th align="left">Status</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((x, i) => (
            <tr key={i} style={{borderTop:'1px solid #ddd'}}>
              <td>{x.orderId}</td>
              <td>{x.paymentId}</td>
              <td>{(Number(x.amount)/100).toFixed(2)} {x.currency}</td>
              <td>{x.status || '—'}</td>
              <td style={{textAlign:'center'}}><a href={`/checkout/${x.token}`} target="_blank">Open</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
