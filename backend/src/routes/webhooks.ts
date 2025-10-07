import { Router } from 'express';
import { prisma } from '../db';
import { verifyHmac } from '../utils/hmac';
import 'dotenv/config';
import bodyParser from 'body-parser';

const r = Router();

// raw webhook endpoint: defined in index.ts with bodyParser.raw
r.post('/qatarchash', async (req: any, res) => {
  const SECRET = process.env.WEBHOOK_SECRET || 'dev_webhook_secret';
  const sig = req.headers['x-qc-sign'] as string | undefined;
  const raw = req.body as Buffer;
  if (!verifyHmac(SECRET, raw, sig)) return res.status(401).json({ error: 'invalid_signature' });

  const json = JSON.parse(raw.toString('utf8') || '{}');
  const { paymentId, status } = json;
  if (!paymentId) return res.status(400).json({ error: 'missing_paymentId' });

  await prisma.paymentLink.updateMany({ where: { paymentId }, data: { status: status || 'captured' } });
  return res.json({ ok: true });
});

// simulate
r.post('/qatarchash/simulate-capture', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const paymentId = (req.body?.paymentId as string) || '';
  await prisma.paymentLink.updateMany({ where: { paymentId }, data: { status: 'captured' } });
  res.send(`<html><body style="font-family:system-ui"><h3>Paid ✔</h3><p>paymentId: ${paymentId}</p></body></html>`);
});

export default r;
