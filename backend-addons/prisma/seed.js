import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const USERS = [
  { email: 'ali@example.com', name: 'Ali' },
  { email: 'noor@example.com', name: 'Noor' },
  { email: 'sara@example.com', name: 'Sara' },
];

async function main() {
  const created = [];
  for (const u of USERS) {
    const res = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: u,
    });
    created.push(res);
  }

  for (const u of created) {
    await prisma.transaction.createMany({
      data: [
        { userId: u.id, amount: 100.25, currency: 'QAR', memo: 'Initial deposit' },
        { userId: u.id, amount: -25.40, currency: 'QAR', memo: 'Card purchase' }
      ]
    });
  }
  console.log('Seed complete:', created.map(x => x.email));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
