import { Router } from 'express';
import QRCode from 'qrcode';
import { ensureRedis, redis } from '../infra/redis';
import { prisma } from '../db';

const r = Router();

function html(title: string, body: string){
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 0; }
  header { padding: 16px 20px; border-bottom: 1px solid #ccc3; display:flex; align-items:center; gap:10px; }
  main { max-width: 720px; margin: 0 auto; padding: 24px; }
  .card { border: 1px solid #ccc3; border-radius: 12px; padding: 20px; box-shadow: 0 4px 14px #0001; }
  .row { display:flex; gap:16px; align-items:center; flex-wrap:wrap; }
  .qr { width: 240px; height: 240px; border-radius: 8px; }
  button { padding: 12px 16px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; }
  .primary { background: #2563eb; color: white; }
  .muted { color: #666; font-size: 14px; }
  .kvs { display:grid; grid-template-columns: 160px 1fr; gap:8px; margin: 12px 0; }
  .kvs div { padding: 4px 0; }
  footer { padding:16px 20px; border-top: 1px solid #ccc3; text-align:center; font-size: 12px; color:#777; }
  a { color: #2563eb; text-decoration: none; }

  .success { color: #16a34a; }
  .danger { color: #dc2626; }
  .brand { display:flex; align-items:center; gap:10px; }
  .brand img { height: 28px; }
  .pill { display:inline-block; padding:4px 10px; border-radius:999px; background:#0ea5e9; color:white; font-weight:600; font-size:12px;}
</style>
</head>
<body>
<header><div class='brand'><img src='https://dummyimage.com/64x28/2563eb/ffffff&text=QC' alt='QC'/><strong>QatarCash</strong></div><span class="pill">Hosted Checkout</span></header>
<main>${body}</main>
<footer>Secured by QatarCash — do not share this link publicly.</footer>
</body>
</html>`;
}

r.get('/:token', async (req, res) => {
  await ensureRedis();
  let data = null as any;
  const row = await prisma.paymentLink.findUnique({ where: { token: req.params.token } });
  if (row) data = JSON.stringify(row);
  else data = await redis.get(`qc:plink:${req.params.token}`);
  if (!data) return res.status(404).send(html('Not found', '<div class="card"><h2>Invalid or expired link</h2><p>Please request a new payment link.</p></div>'));
  const obj = JSON.parse(data);
  const amountQAR = (Number(obj.amount)/100).toFixed(2); // obj from DB or Redis
  const qrPng = await QRCode.toDataURL(obj.emv, { errorCorrectionLevel: 'M' });

  const body = `
  <div class="card">
    <h2>Pay ${amountQAR} QAR</h2>
    <div class="row">
      <img class="qr" src="${qrPng}" alt="EMV QR" />
      <div>
        <div class="kvs">
          <div>Order</div><div>${obj.orderId || '-'}</div>
          <div>Payment ID</div><div>${obj.paymentId || '-'}</div>
          <div>Currency</div><div>${obj.currency || 'QAR'}</div>
        </div>
        <div class="row" style="gap:8px;">
          <a href="${obj.checkoutUrl}" rel="noreferrer"><button class="primary">Continue to Pay</button></a>
          <a href="/docs" target="_blank" rel="noreferrer"><button>Help</button></a>
        </div>
        <p class="muted">Scan the QR with a compatible banking app or click continue.</p>
      </div>
    </div>
      <div class="muted" id="status">Waiting for payment...</div>
      <script>
        const statusEl = document.getElementById('status');
        async function poll(){
          try{
            const r = await fetch(`/api/payment-links/${encodeURIComponent("%s")}/status`);
            if(!r.ok) throw new Error('status error');
            const j = await r.json();
            if(j.status){
              statusEl.textContent = 'Status: ' + j.status;
              if(j.status.toLowerCase().includes('captur') || j.status.toLowerCase().includes('paid'))
                statusEl.className = 'success';
              if(j.status.toLowerCase().includes('fail') || j.status.toLowerCase().includes('declin'))
                statusEl.className = 'danger';
            }
          }catch(e){ /* ignore */ }
        }
        setInterval(poll, 3000);
        poll();
      </script>
    </div>
  </div>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html('Checkout', body.replace('%s', req.params.token)));
});

export default r;
