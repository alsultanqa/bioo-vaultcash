'use client';
import { useState } from 'react';

export default function Login(){
  const [email, setEmail] = useState('owner@qatarchash.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [token, setToken] = useState('');
  const [needMfa, setNeedMfa] = useState(false);
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  const doLogin = async () => {
    const r = await fetch(base + '/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password, token: needMfa ? token : undefined })});
    const j = await r.json();
    if (j.error === 'mfa_required_or_invalid'){ setNeedMfa(true); return; }
    if (j.token){ localStorage.setItem('qc_jwt', j.token); window.location.href = '/admin/payments'; }
  };

  return (
    <main style={{padding:24, maxWidth:420, margin:'0 auto'}}>
      <h1>Login</h1>
      <div style={{display:'grid', gap:10}}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {needMfa && <input placeholder="TOTP token" value={token} onChange={e=>setToken(e.target.value)} />}
        <button onClick={doLogin}>Sign in</button>
      </div>
      <p style={{color:'#666'}}>Tip: register via POST /auth/register (dev only) ثم فعّل MFA من /auth/mfa/setup.</p>
    </main>
  );
}
