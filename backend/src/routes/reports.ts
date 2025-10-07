import { Router } from 'express';
import { listEntries, trialBalance } from '../ledger/ledger';
import { ensureRedis, redis } from '../infra/redis';

const r = Router();

r.get('/reports/ledger.json', (_req, res) => res.json({ entries: listEntries(), balance: trialBalance() }));

r.get('/reports/ledger.csv', (_req, res) => {
  const e = listEntries(10000);
  const rows = [['id','ts','type','ref','account','side','amount']];
  for (const en of e){
    for (const p of en.postings){
      rows.push([en.id,en.ts,en.type,en.ref,p.account,p.side,p.amount]);
    }
  }
  const csv = rows.map(r => r.join(',')).join('\n');
  res.setHeader('Content-Type','text/csv; charset=utf-8');
  res.send(csv);
});

// Simple payments snapshot from Redis payment-links
r.get('/reports/payments.json', async (_req, res) => {
  await ensureRedis();
  const items: any[] = [];
  let cursor = '0';
  do{
    const scan = await redis.scan(cursor, 'MATCH', 'qc:plink:*', 'COUNT', 100);
    cursor = scan[0];
    const keys = scan[1];
    if (keys.length){
      const vals = await redis.mget(keys);
      keys.forEach((k, i) => { try { const o = JSON.parse(vals[i] || '{}'); items.push({ key: k, ...o }); } catch(_){} });
    }
  } while(cursor !== '0');
  res.json({ items });
});

export default r;
