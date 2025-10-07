import { Router } from 'express';
import { prisma } from '../db';
const r = Router();
r.get('/:token', async (req, res) => {
  const pl = await prisma.paymentLink.findUnique({ where: { token: req.params.token } });
  if (!pl) return res.status(404).send('Link not found');
  const amountQAR = (pl.amount / 100).toFixed(2);
  res.send(`<html><body style="font-family:system-ui"><h2>QatarCash • Checkout</h2><p>Order: ${pl.orderId}</p><p>Amount: ${amountQAR} ${pl.currency}</p></body></html>`);
});
export default r;
