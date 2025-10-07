import { Router } from 'express';
import { z } from 'zod';
import { createPayment, getPaymentStatus, refundPayment } from '../clients/acquirer';
import { ensureRedis, redis } from '../infra/redis';

const r = Router();
const CreateSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().default('QAR'),
  orderId: z.string().min(1),
  customer: z.object({ email: z.string().email().optional(), phone: z.string().optional(), name: z.string().optional() }).optional(),
  callbackUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

r.post('/', async (req, res, next) => {
  try {
    const data = CreateSchema.parse(req.body);
    const key = req.header('Idempotency-Key');
    if (key) {
      await ensureRedis();
      const ok = await redis.set(`qc:idemp:${key}`, '1', 'NX', 'EX', 3600);
      if (ok !== 'OK') return res.status(409).json({ error: 'idempotency_conflict' });
    }
    res.json(await createPayment(data));
  } catch (e) { next(e); }
});

r.get('/:id', async (req, res, next) => {
  try { res.json(await getPaymentStatus(req.params.id)); }
  catch (e) { next(e); }
});

r.post('/refunds', async (req, res, next) => {
  try {
    const RefSchema = z.object({ paymentId: z.string().min(1), amount: z.number().int().positive() });
    const data = RefSchema.parse(req.body);
    res.json(await refundPayment(data));
  } catch (e) { next(e); }
});

export default r;
