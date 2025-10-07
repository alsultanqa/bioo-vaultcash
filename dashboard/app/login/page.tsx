'use client';
import { useState } from 'react';
import { api, setToken } from '../../lib/api';

export default function Login(){
  const [email,setEmail]=useState('owner@qatarchash.local');
  const [password,setPassword]=useState('ChangeMe123!');
  const [err,setErr]=useState('');

  async function submit(e:any){
    e.preventDefault();
    try{
      const res = await api('/auth/login', { method:'POST', body: JSON.stringify({ email, password }) });
      setToken(res.token); location.href='/admin/links';
    }catch{ setErr('بيانات الدخول غير صحيحة'); }
  }

  return (
    <main style={{display:'grid',placeItems:'center',height:'100vh'}}>
      <form onSubmit={submit} className="card" style={{width:360}}>
        <h2>دخول الأدمن</h2>
        <div><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" /></div>
        <div style={{marginTop:8}}><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" /></div>
        {err && <p style={{color:'#f87171'}}>{err}</p>}
        <button className="btn" style={{marginTop:12,width:'100%'}}>دخول</button>
      </form>
    </main>
  );
}
