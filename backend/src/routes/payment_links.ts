import { Router } from 'express';
import { prisma } from '../db';
import crypto from 'crypto';
const r = Router();
r.post('/', async (req, res) => {
  const { amount, currency, orderId } = req.body || {};
  if(!amount || !currency || !orderId) return res.status(400).json({ error: 'missing_fields' });
  const token = crypto.randomBytes(10).toString('hex');
  const paymentId = 'pay_' + crypto.randomBytes(8).toString('hex');
  const checkoutUrl = `${process.env.PUBLIC_BASE_URL || 'http://localhost:3001'}/pay/${token}`;
  await prisma.paymentLink.create({ data: { token, paymentId, checkoutUrl, orderId, amount, currency, status: 'created' } });
  res.status(201).json({ token, paymentId, checkoutUrl });
});
export default r;
