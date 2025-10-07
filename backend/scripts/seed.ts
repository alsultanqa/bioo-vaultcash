import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const prisma = new PrismaClient();

async function main() {
  const email = 'owner@qatarchash.local';
  const pass  = 'ChangeMe123!';
  const hash = await bcrypt.hash(pass, 12);
  await prisma.user.upsert({
    where: { email }, update: {},
    create: { email, password: hash, role: 'OWNER' }
  });
  const token = crypto.randomBytes(10).toString('hex');
  const paymentId = 'pay_' + crypto.randomBytes(8).toString('hex');
  await prisma.paymentLink.create({
    data: { token, paymentId, checkoutUrl: 'http://localhost:3001/pay/'+token, orderId: 'SEED-1001', amount: 1500, currency: 'QAR', status: 'created' }
  });
  console.log({ login: { email, pass }, seededPaymentLink: token });
}
main().finally(()=>prisma.$disconnect());
