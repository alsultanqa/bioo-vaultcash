# QatarCash – Pro Starter

## تشغيل سريع (Docker)
```bash
docker compose up --build
```
- Backend: http://localhost:3001
- Dashboard: http://localhost:3000

### تهيئة قاعدة البيانات (مرة واحدة عند أول تشغيل محلي بدون Docker)
```bash
cd backend
cp .env.example .env
npm ci
npm run db:generate
npm run db:migrate
npm run seed
npm run dev
```
- سجّل الدخول إلى لوحة الأدمن: `owner@qatarchash.local / ChangeMe123!`

## REST Endpoints
- `POST /api/payment-links` → {amount, currency, orderId} → {token, paymentId, checkoutUrl}
- `GET  /api/status/:token`
- `GET  /pay/:token` → صفحة دفع بسيطة (simulate)
- `POST /webhooks/qatarchash` → تحديث حالة الدفع
- أدمن:
  - `POST /auth/login` → JWT
  - `GET  /admin/payment-links?page=&pageSize=&q=`
  - `PATCH/DELETE /admin/payment-links/:token`
  - `GET/POST/DELETE /admin/api-keys`

## إعدادات
- `backend/.env.example` يوضح المتغيرات.
- CORS مضبوط على `http://localhost:3000` افتراضيًا.

## الإنتاج
- بدّل Postgres إلى خدمة مُدارة.
- استخدم `npm run build && npm start` للـbackend وdashboard.
- فعّل HTTPS وWAF وmTLS حسب بيئتك.
