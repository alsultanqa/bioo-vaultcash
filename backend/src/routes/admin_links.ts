import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../auth/jwt';

const r = Router();
r.use(requireAuth, requireRole('OWNER','ADMIN','FINANCE'));

r.get('/payment-links', async (req, res) => {
  const q = (req.query.q as string) || '';
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(String(req.query.pageSize || '20'), 10)));
  const where = q ? { OR:[{ orderId: { contains: q } }, { paymentId: { contains: q } }] } : {};

  const [items, total] = await Promise.all([
    prisma.paymentLink.findMany({
      where, orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize, take: pageSize
    }),
    prisma.paymentLink.count({ where })
  ]);

  res.json({ items, page, pageSize, total, pages: Math.ceil(total / pageSize) });
});

r.patch('/payment-links/:token', async (req, res) => {
  const { status } = req.body || {};
  const pl = await prisma.paymentLink.update({ where: { token: req.params.token }, data: { status } });
  res.json(pl);
});

r.delete('/payment-links/:token', async (req, res) => {
  await prisma.paymentLink.delete({ where: { token: req.params.token } });
  res.json({ ok: true });
});

export default r;
