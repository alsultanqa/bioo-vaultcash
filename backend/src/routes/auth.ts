import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db';
import { signJwt } from '../auth/jwt';

const r = Router();

r.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if(!email || !password) return res.status(400).json({ error: 'missing_fields' });
  const u = await prisma.user.findUnique({ where: { email } });
  if(!u) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = await bcrypt.compare(password, u.password);
  if(!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = signJwt({ id: u.id, email: u.email, role: u.role as any });
  res.json({ token, user: { id: u.id, email: u.email, role: u.role } });
});

export default r;
