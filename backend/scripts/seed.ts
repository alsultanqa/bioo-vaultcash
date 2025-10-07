import 'dotenv/config';
import { prisma } from '../src/db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

async function main(){
  const email = process.env.SEED_EMAIL || 'owner@qatarchash.local';
  const pass  = process.env.SEED_PASSWORD || 'ChangeMe123!';
  const hash = await bcrypt.hash(pass, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: hash, role: 'OWNER' }
  });
  const merchant = await prisma.merchant.upsert({
    where: { id: 'seed-merchant' },
    update: {},
    create: { id: 'seed-merchant', name: 'QatarCash Demo Merchant', city: 'Doha' }
  });
  const apiKey = await prisma.apiKey.upsert({
    where: { key: 'qc_test_' },
    update: {},
    create: { key: 'qc_test_' + crypto.randomBytes(8).toString('hex'), label: 'Default', environment: 'test', merchantId: merchant.id }
  });
  console.log('Seed complete:');
  console.log({ email, password: pass, merchant: merchant.name, apiKey: apiKey.key });
}

main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
