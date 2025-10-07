'use client';
import { useState } from 'react';

export default function MFASettings(){
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
  const [qr, setQr] = useState<string>('');
  const [token, setToken] = useState<string>('');

  async function setup(){
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ location.href='/login'; return; }
    const r = await fetch(base + '/auth/mfa/setup', { method:'POST', headers:{ Authorization:'Bearer '+jwt } });
    const j = await r.json(); setQr(j.qrDataUrl || '');
  }
  async function verify(){
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ location.href='/login'; return; }
    const r = await fetch(base + '/auth/mfa/verify', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+jwt }, body: JSON.stringify({ token }) });
    if (r.ok) alert('MFA enabled!');
  }

  return (
    <main style={{padding:24}}>
      <h1>MFA (TOTP)</h1>
      <button onClick={setup}>Generate QR</button>
      {qr && <div><img src={qr} alt="MFA QR" /></div>}
      <div style={{marginTop:12}}>
        <input placeholder="Enter 6-digit TOTP" value={token} onChange={e=>setToken(e.target.value)} />
        <button onClick={verify}>Verify</button>
      </div>
    </main>
  );
}
