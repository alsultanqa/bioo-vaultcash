import { Router } from 'express';
import { ensureRedis, redis } from '../infra/redis';
import { prisma } from '../db';

const r = Router();

r.get('/:token', async (req, res) => {
  await ensureRedis();
  let data = null as any;
  const row = await prisma.paymentLink.findUnique({ where: { token: req.params.token } });
  if (row) data = JSON.stringify(row);
  else data = await redis.get(`qc:plink:${req.params.token}`);
  if (!data) return res.status(404).send('Link not found');
  const obj = JSON.parse(data);
  // simple redirect to acquirer checkout
  return res.redirect(302, obj.checkoutUrl || '/');
});

export default r;
