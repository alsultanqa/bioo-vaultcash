# QatarCash Backend — Hosted Checkout

## Endpoints
- `POST /api/payment-links` → returns `{ linkUrl, token, emv, qrPngDataUrl, checkoutUrl }`
- `GET  /pay/:token` → redirects to acquirer checkout
- `GET  /checkout/:token` → **Hosted Checkout page** with EMV‑QR and button to continue
- `GET  /docs` → Swagger UI

> Set `PUBLIC_BASE_URL` in `.env` to render correct link URLs.



## New Endpoints/Features
- `GET  /api/payment-links/:token/status` → returns current status (from webhook cache or acquirer)
- `GET  /success/:token` and `GET /cancel/:token` → result pages; **success** waits for webhook-confirmed status
- Optional notifications: include `notifyEmail`, `notifyPhone` in `POST /api/payment-links` to send the link
- Configure SMTP/Twilio in `.env` to enable notifications



## Reconciliation & Ledger
- `GET /reports/ledger.json` + `GET /reports/ledger.csv` — تصدير قيود الدفتر المزدوج (JSON/CSV)
- `GET /reports/payments.json` — لقطة روابط/مدفوعات من Redis
- تُسجّل قيود الالتقاط/الاسترداد تلقائياً عند استقبال الويبهوك

## Admin APIs
- `GET /admin/payment-links` — قائمة الروابط مع الحالة الحالية

## Acquirer Adapter
- محول **Mock** افتراضي الآن. تستطيع لاحقاً استبداله بمحول `NAPS`/`<Acquirer>` عبر `getAcquirer()`.



## Auth & RBAC
- Endpoints: `/auth/register` (DEV only), `/auth/login`, `/auth/mfa/setup`, `/auth/mfa/verify`
- JWT في ترويسة `Authorization: Bearer <token>`
- أدوار: OWNER / ADMIN / FINANCE / DEVELOPER
- تم تقييد `GET /admin/payment-links` بوجود JWT ودور مناسب

## Database (Postgres via Prisma)
- عدّل `DATABASE_URL` ثم شغّل:
  - `npx prisma generate`
  - `npx prisma migrate dev --name init`
- استبدل التخزين المؤقت JSON/Redis لاحقاً بمخازن جداول فعلية للمدفوعات والتسويات.

## Acquirer Adapter
- اختر عبر `QC_ACQUIRER=mock` أو `naps`
- لمحول NAPS: اضبط `NAPS_BASE_URL`, `NAPS_API_KEY`, `NAPS_API_SECRET`



## Payment Links Storage Migration
- تمت إضافة جدول `PaymentLink` في Postgres.
- المسارات تقرأ الآن من **Postgres أولاً**، وتعود إلى Redis إن لم يوجد صف (تدرّج سلس).
- عند إنشاء رابط: تُحفَظ البيانات في Postgres وRedis (EX 24h) — يمكنك لاحقاً حذف Redis.

## Seed
- سكربت: `npm run seed` (يحتاج `DATABASE_URL`)
- متغيرات اختيارية: `SEED_EMAIL`, `SEED_PASSWORD`
