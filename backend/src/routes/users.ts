import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../auth/middleware';

const r = Router();

r.get('/users', requireAuth, requireRole('OWNER','ADMIN'), async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id:true, email:true, role:true, createdAt:true } });
  res.json({ items: users });
});

r.post('/users', requireAuth, requireRole('OWNER','ADMIN'), async (req, res) => {
  const { email, role } = req.body || {};
  if (!email || !role) return res.status(400).json({ error: 'missing_fields' });
  const u = await prisma.user.create({ data: { email, password: '$2b$12$5a7GzVhZ2yJt3cEE4g7b6u1wCawqmC5mC7i9O2V0YI3DtxxYX2v8a', role } });
  res.json({ id: u.id, email: u.email, role: u.role });
});

r.patch('/users/:id', requireAuth, requireRole('OWNER','ADMIN'), async (req, res) => {
  const { role } = req.body || {};
  const u = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
  res.json({ id: u.id, email: u.email, role: u.role });
});

export default r;
