import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { json } from 'express';
import { corsMw } from './middleware/cors';
import { rateLimit } from './middleware/rate_limit';
import { errorHandler } from './middleware/error';
import paymentLinks from './routes/payment_links';
import hosted from './routes/hosted';
import auth from './routes/auth';

const app = express();
app.use(morgan('dev'));
app.use(corsMw);
app.use(rateLimit);
app.use(json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/payment-links', paymentLinks);
app.use('/pay', hosted);
app.use('/auth', auth);

app.use(errorHandler);
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`QC backend on :${port}`));
