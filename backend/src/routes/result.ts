import { Router } from 'express';
import { ensureRedis, redis } from '../infra/redis';

const r = Router();

function shell(title: string, body: string){
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title}</title>
  <style>body{font-family:system-ui;margin:0}main{max-width:720px;margin:0 auto;padding:24px}.card{border:1px solid #ccc3;border-radius:12px;padding:20px;box-shadow:0 4px 14px #0001}</style></head>
  <body><main>${body}</main></body></html>`;
}

r.get('/success/:token', async (req, res) => {
  await ensureRedis();
  const data = await redis.get(`qc:plink:${req.params.token}`);
  if (!data) return res.status(404).send(shell('Not found','<div class="card"><h2>Invalid link</h2></div>'));
  const obj = JSON.parse(data);
  const paid = await redis.get(`qc:pay:${obj.paymentId}:status`);
  const ok = paid && /paid|capture/i.test(paid);
  const body = ok ? `<div class="card"><h2>Payment Successful</h2><p>Payment ID: ${obj.paymentId}</p><p>Order: ${obj.orderId}</p></div>`
                  : `<div class="card"><h2>Not Confirmed Yet</h2><p>We have not received a confirmed webhook. Try again later.</p></div>`;
  res.send(shell('Success', body));
});

r.get('/cancel/:token', async (req, res) => {
  await ensureRedis();
  const data = await redis.get(`qc:plink:${req.params.token}`);
  if (!data) return res.status(404).send(shell('Not found','<div class="card"><h2>Invalid link</h2></div>'));
  const obj = JSON.parse(data);
  res.send(shell('Canceled', `<div class="card"><h2>Payment Canceled</h2><p>Payment ID: ${obj.paymentId}</p><p>Order: ${obj.orderId}</p></div>`));
});

export default r;
