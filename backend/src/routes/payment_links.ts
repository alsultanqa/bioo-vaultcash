import { Router } from 'express';
import { z } from 'zod';
import { ensureRedis, redis } from '../infra/redis';
import { prisma } from '../db';
import { createPayment } from '../clients/acquirer';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { buildEmvMpm } from '../utils/emvqr';

const r = Router();
import { sendEmail } from '../utils/mailer';
import { sendSms } from '../utils/sms';
const TTL = 86400; // 24h

const CreateLinkSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('QAR'),
  orderId: z.string().min(1),
  merchantName: z.string().default(process.env.MERCHANT_NAME || 'QatarCash Merchant'),
  merchantCity: z.string().default(process.env.MERCHANT_CITY || 'Doha'),
  notifyEmail: z.string().email().optional(),
  notifyPhone: z.string().optional(),
});

function toNumericCurrency(code: string): string {
  // ISO 4217 numeric for common currencies; extend as needed
  const map: Record<string, string> = { QAR: '634', USD: '840', EUR: '978' };
  return map[code.toUpperCase()] || '634';
}

r.post('/', async (req, res, next) => {
  try {
    const d = CreateLinkSchema.parse(req.body);
    // 1) create payment via acquirer (or internal intent)
    const pay = await createPayment({ amount: d.amount, currency: d.currency, orderId: d.orderId });

    // 2) create token -> store mapping to checkoutUrl/paymentId
    await ensureRedis();
    const token = crypto.randomUUID();
    const key = `qc:plink:${token}`;
    await redis.set(key, JSON.stringify({ paymentId: pay.paymentId, checkoutUrl: pay.checkoutUrl }), 'EX', TTL);

    // 3) build EMV payload
    const emv = buildEmvMpm({
      merchantName: d.merchantName,
      merchantCity: d.merchantCity,
      currencyNumeric: toNumericCurrency(d.currency),
      amount: Number.isFinite(d.amount) ? (d.amount/100).toFixed(2) : undefined,
      reference: d.orderId,
    });

    // 4) generate QR PNG (data URL)
    const qrDataUrl = await QRCode.toDataURL(emv, { errorCorrectionLevel: 'M' });

    const linkUrl = `${process.env.PUBLIC_BASE_URL || 'http://localhost:3001'}/pay/${token}`;
    if (d.notifyEmail) { await sendEmail(d.notifyEmail, 'Your payment link', `<p>Please pay <b>${(d.amount/100).toFixed(2)} ${d.currency}</b> via <a href='${linkUrl}'>${linkUrl}</a></p>`); }
    if (d.notifyPhone) { await sendSms(d.notifyPhone, `Pay ${(d.amount/100).toFixed(2)} ${d.currency}: ${linkUrl}`); }
    res.json({ linkUrl, token, paymentId: pay.paymentId, checkoutUrl: pay.checkoutUrl, emv, qrPngDataUrl: qrDataUrl });
  } catch (e) { next(e); }
});

export default r;
