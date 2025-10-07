'use client';
import { ReactNode, useEffect } from 'react';
import { getToken } from '../../lib/api';
import '../globals.css';

export default function AdminLayout({ children }: { children: ReactNode }){
  useEffect(()=>{ if(!getToken()) location.href='/login'; }, []);
  return (
    <div style={{maxWidth:1000, margin:'32px auto', padding:'0 16px'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h2>لوحة QatarCash</h2>
        <nav style={{display:'flex', gap:8}}>
          <a href="/admin/links" className="btn" style={{background:'#1f2937'}}>الروابط</a>
          <a href="/admin/new"   className="btn">رابط جديد</a>
        </nav>
      </header>
      <div className="card">{children}</div>
    </div>
  );
}
