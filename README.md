# QatarCash – Ultimate

## تشغيل سريع (Docker)
```bash
docker compose up --build
```
- Backend: http://localhost:3001/health
- Dashboard: http://localhost:3000/login
- دخول: owner@qatarchash.local / ChangeMe123!

## محلي بدون Docker
```bash
# Backend
cd backend
cp .env.example .env
npm ci
npx prisma generate
npm run db:migrate
npm run seed
npm run dev

# Dashboard
cd ../dashboard
export NEXT_PUBLIC_API_BASE="http://localhost:3001"
npm ci
npm run dev
```

## CI
- GitHub Actions: `.github/workflows/ci.yml`

## إنتاج
- صور Docker-prod: `backend/Dockerfile.prod` و `dashboard/Dockerfile.prod`
- Compose: `docker-compose.prod.yml`
- Kubernetes: `infra/k8s/*` (أنشئ الأسرار: JWT_SECRET و WEBHOOK_SECRET)
- Terraform: `infra/terraform/*` (نشر الواجهة عبر S3+CloudFront)

## API
- OpenAPI: `backend/openapi.yaml`
- Webhooks: HMAC `X-QC-SIGN` باستخدام `WEBHOOK_SECRET`

## ملاحظات
- غيّر ALLOWED_ORIGINS وドومينات الإنتاج قبل الإطلاق.
- افحص السجلات في جدول AuditLog لأي عملية حساسة.
