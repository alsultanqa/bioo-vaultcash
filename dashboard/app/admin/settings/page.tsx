'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

type Key = { id:string; key:string; label?:string; environment:string; createdAt:string };

export default function Settings(){
  const [items,setItems]=useState<Key[]>([]);
  const [loading,setLoading]=useState(false);

  async function load(){ setLoading(true); const j = await api('/admin/api-keys'); setItems(j.items||[]); setLoading(false); }
  async function createKey(){ await api('/admin/api-keys', { method:'POST' }); load(); }
  async function revoke(id:string){ if(!confirm('إبطال المفتاح؟'))return; await api(`/admin/api-keys/${id}`,{method:'DELETE'}); load(); }

  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <h3>مفاتيح API</h3>
      <button className="btn" onClick={createKey} disabled={loading}>إنشاء مفتاح جديد</button>
      <table className="table" style={{marginTop:12}}>
        <thead><tr><th>المفتاح</th><th>البيئة</th><th>أُنشيء</th><th></th></tr></thead>
        <tbody>
          {items.map(k=>(
            <tr key={k.id}>
              <td style={{fontFamily:'monospace'}}>{k.key}</td>
              <td>{k.environment}</td>
              <td>{new Date(k.createdAt).toLocaleString()}</td>
              <td><button className="btn" style={{background:'#ef4444'}} onClick={()=>revoke(k.id)}>إبطال</button></td>
            </tr>
          ))}
          {items.length===0 && <tr><td colSpan={4}>لا توجد مفاتيح بعد</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
