import { Router } from 'express';
import { verifyHmac } from '../security/hmac';
import { ensureRedis, redis } from '../infra/redis';
import { prisma } from '../db';

const r = Router();
import { post as ledgerPost } from '../ledger/ledger';
const TTL = Number(process.env.IDEMPOTENCY_TTL_SECONDS || 86400);

r.post('/qatarcash', async (req: any, res) => {
  const ok = verifyHmac(req.rawBody, req.headers?.['x-qc-signature'] as string);
  if (!ok) return res.status(400).send('invalid signature');

  const evt = req.body; // {eventId, type, data, ...}
  const id = evt?.eventId || `${evt?.type}:${evt?.data?.id || ''}`;
  await ensureRedis();
  if (id) {
    const set = await redis.set(`qc:webhook:${id}`, '1', 'NX', 'EX', TTL);
    if (set !== 'OK') return res.status(200).send('duplicate');
  }
  // Update payment status cache for hosted pages
  if (evt?.data?.paymentId) {
    await ensureRedis();
    const status = evt?.data?.status || evt?.type;
    await redis.set(`qc:pay:${evt.data.paymentId}:status`, status, 'EX', 86400);
    try { await prisma.paymentLink.updateMany({ where: { paymentId: evt.data.paymentId }, data: { status } }); } catch(_){}
  }
  
  // Post to ledger on capture/paid/refund
  try{
    const type = String(evt?.data?.status || evt?.type || '').toLowerCase();
    const pid = evt?.data?.paymentId || evt?.data?.id || 'unknown';
    const amt = Number(evt?.data?.capturedAmount || evt?.data?.amount || 0);
    if (amt > 0 && (type.includes('captur') || type.includes('paid'))){
      ledgerPost('capture', pid, [
        { account: 'cash_acquirer', side: 'debit',  amount: amt },
        { account: 'merchant_payable', side: 'credit', amount: amt }
      ], { evt });
    }
    if (amt > 0 && type.includes('refund')){
      ledgerPost('refund', pid, [
        { account: 'merchant_payable', side: 'debit',  amount: amt },
        { account: 'cash_acquirer', side: 'credit', amount: amt }
      ], { evt });
    }
  } catch(e) { /* ignore ledger failure in webhook path */ }
  return res.status(200).send('ok');
});

export default r;
