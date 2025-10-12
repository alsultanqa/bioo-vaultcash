# Minibank Backend (Express + Prisma + PostgreSQL) — Ready for Elastic Beanstalk

## المتغيرات المطلوبة (EB → Configuration → Software)
- PORT=3001
- DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/DBNAME
- (اختياري) ALLOWED_ORIGINS

## النشر
1) ارفع `minibank-backend-prisma.zip` عبر **Upload and deploy**.
2) بعد النشر، افتح `/health` للتأكد من اتصال القاعدة.
3) أول ما تتضبط `DATABASE_URL` سيقوم هوك **postdeploy** بتشغيل `prisma migrate deploy` تلقائيًا.

## نقاط اختبار
- `GET /health` → { ok: true, db: 'up' } عند اتصال قاعدة البيانات
- `POST /users` { email, name }
- `GET /users`
- `POST /txs` { userId, amount, currency?, memo? }
- `GET /txs`
