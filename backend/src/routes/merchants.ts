import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../auth/middleware';

const r = Router();

r.get('/merchants', requireAuth, requireRole('OWNER','ADMIN'), async (_req, res) => {
  const ms = await prisma.merchant.findMany({ select: { id:true, name:true, city:true } });
  res.json({ items: ms });
});

export default r;
