import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL || 'owner@qatarchash.local';
  const pass  = process.env.SEED_PASSWORD || 'ChangeMe123!';
  const hash = await bcrypt.hash(pass, 12);

  const user = await prisma.user.upsert({
    where: { email }, update: {},
    create: { email, password: hash, role: 'OWNER' }
  });

  const merchant = await prisma.merchant.upsert({
    where: { id: 'seed-merchant' }, update: {},
    create: { id: 'seed-merchant', name: 'QatarCash Demo', city: 'Doha' }
  });

  const apiKey = await prisma.apiKey.create({
    data: {
      key: 'qc_test_' + crypto.randomBytes(8).toString('hex'),
      label: 'Default', environment: 'test', merchantId: merchant.id
    }
  });

  console.log({ login: { email, pass }, apiKey: apiKey.key });
}
main().finally(() => prisma.$disconnect());
