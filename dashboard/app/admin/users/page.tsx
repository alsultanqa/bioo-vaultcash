'use client';
import { useEffect, useState } from 'react';

type User = { id:string; email:string; role:string };

export default function UsersPage(){
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('user@example.com');
  const [role, setRole] = useState('DEVELOPER');
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

  async function load(){
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ location.href='/login'; return; }
    const r = await fetch(base + '/users', { headers: { Authorization: 'Bearer ' + jwt } });
    const j = await r.json(); setUsers(j.items||[]);
  }
  useEffect(()=>{ load(); }, []);

  async function create(){
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ location.href='/login'; return; }
    const r = await fetch(base + '/users', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+jwt }, body: JSON.stringify({ email, role }) });
    if(r.ok) load();
  }
  async function updateRole(id:string, role:string){
    const jwt = localStorage.getItem('qc_jwt'); if(!jwt){ location.href='/login'; return; }
    const r = await fetch(base + '/users/'+id, { method:'PATCH', headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+jwt }, body: JSON.stringify({ role }) });
    if(r.ok) load();
  }

  return (
    <main style={{padding:24}}>
      <h1>Users & Roles</h1>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:16}}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option>OWNER</option><option>ADMIN</option><option>FINANCE</option><option>DEVELOPER</option>
        </select>
        <button onClick={create}>Invite/Create</button>
      </div>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Email</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{borderTop:'1px solid #ddd'}}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select defaultValue={u.role} onChange={e=>updateRole(u.id, e.target.value)}>
                  <option>OWNER</option><option>ADMIN</option><option>FINANCE</option><option>DEVELOPER</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
