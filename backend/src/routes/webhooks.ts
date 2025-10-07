import { Router } from 'express';
import { prisma } from '../db';
import bodyParser from 'body-parser';

const r = Router();
r.use(bodyParser.urlencoded({ extended: true }));
r.use(bodyParser.json());

r.post('/qatarchash', async (req, res) => {
  const { paymentId, status } = req.body || {};
  if (!paymentId) return res.status(400).json({ error: 'missing_paymentId' });
  await prisma.paymentLink.updateMany({ where: { paymentId }, data: { status: status || 'captured' } });
  return res.json({ ok: true });
});

r.post('/qatarchash/simulate-capture', async (req, res) => {
  const paymentId = (req.body?.paymentId as string) || '';
  await prisma.paymentLink.updateMany({ where: { paymentId }, data: { status: 'captured' } });
  res.send(`<html><body style="font-family:system-ui"><h3>Paid ✔</h3><p>paymentId: ${paymentId}</p></body></html>`);
});

export default r;
