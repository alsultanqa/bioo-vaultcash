import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db';
import crypto from 'crypto';
const r = Router();
const Create = z.object({ amount: z.number().int().positive(), currency: z.string().min(3).max(3), orderId: z.string().min(2) });
r.post('/', async (req, res, next) => {
  try {
    const d = Create.parse(req.body);
    const token = crypto.randomBytes(10).toString('hex');
    const paymentId = 'pay_' + crypto.randomBytes(8).toString('hex');
    const checkoutUrl = `${process.env.PUBLIC_BASE_URL || 'http://localhost:3001'}/pay/${token}`;
    await prisma.paymentLink.create({ data: { token, paymentId, checkoutUrl, orderId: d.orderId, amount: d.amount, currency: d.currency, status: 'created' } });
    res.status(201).json({ token, paymentId, checkoutUrl });
  } catch (e) { next(e); }
});
export default r;
