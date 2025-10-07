import { Router } from 'express';
import { ensureRedis, redis } from '../infra/redis';
import { prisma } from '../db';
import { getPaymentStatus } from '../clients/acquirer';

const r = Router();

r.get('/:token/status', async (req, res, next) => {
  try {
    await ensureRedis();
    let raw = null as any;
    let obj: any = null;
    const row = await prisma.paymentLink.findUnique({ where: { token: req.params.token } });
    if (row) { obj = row; }
    else { raw = await redis.get(`qc:plink:${req.params.token}`); if (!raw) return res.status(404).json({ error: 'not_found' }); obj = JSON.parse(raw); }
    const cached = await redis.get(`qc:pay:${obj.paymentId}:status`);
    if (cached) { try { await prisma.paymentLink.update({ where: { token: req.params.token }, data: { status: cached } }); } catch(_){}; return res.json({ paymentId: obj.paymentId, status: cached, source: 'webhook' }); }
    // fallback to querying acquirer
    const s = await getPaymentStatus(obj.paymentId);
    return res.json({ paymentId: obj.paymentId, ...s, source: 'acquirer' });
  } catch (e){ next(e); }
});

export default r;
