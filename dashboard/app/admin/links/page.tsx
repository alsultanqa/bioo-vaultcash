'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
type PL = { token:string; paymentId:string; orderId:string; amount:number; currency:string; status:string; createdAt:string; checkoutUrl:string };
type Resp = { items:PL[]; page:number; pageSize:number; total:number; pages:number };
export default function Links(){
  const [state,setState]=useState<Resp>({items:[],page:1,pageSize:20,total:0,pages:0});
  const [q,setQ]=useState('');
  async function load(page=1){
    const j:Resp = await api(`/admin/payment-links?page=${page}&pageSize=${state.pageSize}${q?`&q=${encodeURIComponent(q)}`:''}`);
    setState(j);
  }
  useEffect(()=>{ load(1); }, []);
  return (
    <div>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input className="input" placeholder="بحث بـ orderId / paymentId" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" onClick={()=>load(1)}>بحث</button>
      </div>
      <table className="table">
        <thead><tr><th>Order</th><th>Amount</th><th>Status</th><th>Links</th></tr></thead>
        <tbody>
          {state.items.map(x=>(
            <tr key={x.token}>
              <td>{x.orderId}<div style={{color:'#94a3b8',fontSize:12}}>{x.paymentId}</div></td>
              <td>{(x.amount/100).toFixed(2)} {x.currency}</td>
              <td>{x.status||'-'}</td>
              <td><a href={x.checkoutUrl} target="_blank">Checkout</a></td>
            </tr>
          ))}
          {state.items.length===0 && <tr><td colSpan={4}>لا نتائج</td></tr>}
        </tbody>
      </table>
      <div style={{display:'flex', gap:8, marginTop:12, justifyContent:'flex-end'}}>
        <span>صفحة {state.page} / {state.pages} — إجمالي {state.total}</span>
        <button className="btn" disabled={state.page<=1} onClick={()=>load(state.page-1)}>السابق</button>
        <button className="btn" disabled={state.page>=state.pages} onClick={()=>load(state.page+1)}>التالي</button>
      </div>
    </div>
  );
}
