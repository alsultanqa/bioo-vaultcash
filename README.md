# QatarCash — GitHub Expanded

حل متكامل جاهز بالكامل للعمل على GitHub:
- **Dashboard** (Next.js) يُنشر تلقائيًا على **GitHub Pages** عبر Workflow.
- **CI**: تشغيل اختبارات الباك-إند وبناء Prisma.
- **Backend**: يبني صورة Docker ويُدفع إلى **GitHub Container Registry (GHCR)**.
- **Migrate (يدوي)**: Workflow محمي لتطبيق الـMigrations على قاعدة الإنتاج.

> قبل التشغيل: أضف الـSecrets المطلوبة في إعدادات المستودع → Settings → Secrets and variables → Actions

## Secrets المطلوبة
- `QC_API_BASE` : عنوان الـAPI العلني للباك-إند (مثال: `https://api.example.com` أو `http://localhost:3001` للتجربة).
- `DATABASE_URL` : رابط Postgres للإنتاج (فقط لو تُريد استخدام Workflow الهجرة).
- `GHCR_PAT` : توكن شخصي (أو استخدم GITHUB_TOKEN مع أذونات packages: write) لدفع الصورة إلى GHCR.
- (اختياري) `JWT_SECRET`, `WEBHOOK_SECRET` إن رغبت اختبار الهجرة ضد بيئة فعلية.

## نصيحة التسمية
- لو اسم مستودعك `qatarchash`, فإن GitHub Pages سيكون تحت: `https://<username>.github.io/qatarchash/`.
- Workflow الضبط يأخذ هذا في الاعتبار تلقائيًا باستخدام `BASE_PATH`.

## تشغيل محلي سريع
```bash
docker compose up --build
# Dashboard: http://localhost:3000/login
# Backend:   http://localhost:3001/health
# Login: owner@qatarchash.local / ChangeMe123!
```
