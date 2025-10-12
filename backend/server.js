import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Health endpoints
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: 'up' });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'db_down', detail: String(e) });
  }
});

app.get('/', (_req, res) => {
  res.send('<h1>Minibank Backend (Prisma)</h1><p>Use /users, /txs</p>');
});

// Users CRUD (minimal)
app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { email, name } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email_required' });
  try {
    const u = await prisma.user.create({ data: { email, name } });
    res.status(201).json(u);
  } catch (e) {
    res.status(400).json({ error: 'create_failed', detail: String(e) });
  }
});

// Transactions
app.get('/txs', async (_req, res) => {
  const txs = await prisma.transaction.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  res.json(txs);
});

app.post('/txs', async (req, res) => {
  const { userId, amount, currency = 'QAR', memo } = req.body || {};
  if (!userId || amount == null) return res.status(400).json({ error: 'userId_and_amount_required' });
  try {
    const tx = await prisma.transaction.create({
      data: { userId, amount, currency, memo }
    });
    res.status(201).json(tx);
  } catch (e) {
    res.status(400).json({ error: 'create_failed', detail: String(e) });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Minibank (Prisma) listening on', port));
