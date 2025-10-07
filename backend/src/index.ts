import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { json } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { corsMw } from './middleware/cors';
import { rateLimit } from './middleware/rate_limit';
import { errorHandler } from './middleware/error';
import paymentLinks from './routes/payment_links';
import hosted from './routes/hosted';
import status from './routes/status';
import webhooks from './routes/webhooks';
import auth from './routes/auth';
import adminLinks from './routes/admin_links';
import apiKeys from './routes/api_keys';

const app = express();
app.use(morgan('dev'));
app.use(corsMw);
app.use(rateLimit);

// raw for webhook
app.post('/webhooks/qatarchash', bodyParser.raw({ type: '*/*' }));
app.use(json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/payment-links', paymentLinks);
app.use('/pay', hosted);
app.use('/api/status', status);
app.use('/webhooks', webhooks);
app.use('/auth', auth);
app.use('/admin', adminLinks);
app.use('/admin/api-keys', apiKeys);
app.use('/docs', express.static(path.join(process.cwd(), 'openapi.yaml')));
app.use(errorHandler);
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`QC backend on :${port}`));
