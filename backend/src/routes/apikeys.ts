import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../auth/middleware';

const r = Router();

r.get('/apikeys', requireAuth, requireRole('OWNER','ADMIN','DEVELOPER'), async (_req, res) => {
  const keys = await prisma.apiKey.findMany({ select: { id:true, key:true, label:true, environment:true, merchantId:true, createdAt:true } });
  res.json({ items: keys });
});

r.post('/apikeys', requireAuth, requireRole('OWNER','ADMIN'), async (req, res) => {
  const { merchantId, environment='test', label='Key' } = req.body || {};
  if (!merchantId) return res.status(400).json({ error: 'merchantId_required' });
  const key = `${environment === 'live' ? 'qc_live_' : 'qc_test_'}${crypto.randomBytes(16).toString('hex')}`;
  const k = await prisma.apiKey.create({ data: { key, label, environment, merchantId } });
  res.json(k);
});

r.delete('/apikeys/:id', requireAuth, requireRole('OWNER','ADMIN'), async (req, res) => {
  await prisma.apiKey.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default r;
