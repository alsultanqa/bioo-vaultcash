import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();
function rand(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min; }
function pick<T>(a:T[]){ return a[Math.floor(Math.random()*a.length)]; }

async function main() {
  // Admin owner
  const email = process.env.SEED_EMAIL || 'owner@qatarchash.local';
  const pass  = process.env.SEED_PASSWORD || 'ChangeMe123!';
  const hash = await bcrypt.hash(pass, 12);
  await prisma.user.upsert({ where: { email }, update: {}, create: { email, password: hash, role: 'OWNER' } });

  // Merchants
  const merchants = await prisma.$transaction([
    prisma.merchant.upsert({ where: { id: 'seed-merchant' },   update: {}, create: { id: 'seed-merchant',   name: 'QatarCash Demo',     city: 'Doha' } }),
    prisma.merchant.upsert({ where: { id: 'seed-merchant-2' }, update: {}, create: { id: 'seed-merchant-2', name: 'Al Doha Mart',       city: 'Doha' } }),
    prisma.merchant.upsert({ where: { id: 'seed-merchant-3' }, update: {}, create: { id: 'seed-merchant-3', name: 'Souq Waqif Gifts',    city: 'Doha' } }),
  ]);

  // API keys
  for (const m of merchants) {
    for (const env of ['test','live']) {
      await prisma.apiKey.upsert({
        where: { key: `${m.id}_${env}` },
        update: {},
        create: { key: `${m.id}_${env}`, label: env.toUpperCase()+' key', environment: env, merchantId: m.id }
      });
    }
  }

  // Payment links demo
  const currencies = ['QAR','USD'];
  const statuses = ['created','pending','captured','failed','refunded'];
  const batch = [];
  for (let i=0;i<50;i++){
    const token = crypto.randomBytes(10).toString('hex');
    const paymentId = 'pay_' + crypto.randomBytes(8).toString('hex');
    const amount = rand(500, 50000);
    const currency = pick(currencies);
    const status = pick(statuses);
    const orderId = `ORD-${1000+i}`;
    const checkoutUrl = `${process.env.PUBLIC_BASE_URL || 'http://localhost:3001'}/pay/${token}`;
    batch.push(prisma.paymentLink.create({ data: { token, paymentId, checkoutUrl, orderId, amount, currency, status } }));
  }
  await Promise.all(batch);

  console.log('Seed complete. Login:', { email, pass });
}

main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
