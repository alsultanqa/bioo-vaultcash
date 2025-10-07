import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../auth/jwt';
import { audit } from '../utils/audit';

const r = Router();
r.use(requireAuth, requireRole('OWNER','ADMIN'));

r.get('/', async (_req, res) => {
  const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ items: keys });
});

r.post('/', async ( _req, res) => {
  const key = 'qc_live_' + crypto.randomBytes(16).toString('hex');
  const k = await prisma.apiKey.create({
    data: { key, label: 'generated', environment: 'test', merchantId: 'seed-merchant' }
  });
  await audit((req as any).user?.id, 'api_key.create', k.id, { environment: k.environment });
  res.status(201).json(k);
});

r.delete('/:id', async (req, res) => {
  await prisma.apiKey.delete({ where: { id: req.params.id } });
  await audit((req as any).user?.id, 'api_key.delete', req.params.id);
  res.json({ ok: true });
});

export default r;
