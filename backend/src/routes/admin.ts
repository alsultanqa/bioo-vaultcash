import { Router } from 'express';
import { ensureRedis, redis } from '../infra/redis';

const r = Router();
import { requireAuth, requireRole } from '../auth/middleware';

r.get('/admin/payment-links', requireAuth, requireRole('OWNER','ADMIN','FINANCE','DEVELOPER'), async (_req, res) => {
  await ensureRedis();
  const items: any[] = [];
  let cursor = '0';
  do{
    const scan = await redis.scan(cursor, 'MATCH', 'qc:plink:*', 'COUNT', 100);
    cursor = scan[0];
    const keys = scan[1];
    if (keys.length){
      const vals = await redis.mget(keys);
      keys.forEach((k, i) => { try { const o = JSON.parse(vals[i] || '{}'); items.push({ token: k.split(':').pop(), ...o }); } catch(_){} });
    }
  } while(cursor !== '0');
  // attach status if available
  for (const it of items){
    if (it.paymentId){
      const s = await redis.get(`qc:pay:${it.paymentId}:status`);
      if (s) it.status = s;
    }
  }
  res.json({ items });
});

export default r;
