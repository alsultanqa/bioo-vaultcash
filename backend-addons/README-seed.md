## استخدام Seed
1) انسخ `backend-addons/prisma/seed.js` إلى `prisma/seed.js` داخل مشروع الباك إند.
2) عدّل `package.json`:
```json
{
  "scripts": { "seed": "node prisma/seed.js" }
}
```
3) محليًا: `npm run seed`  
4) على EB تلقائيًا بعد النشر (اختياري):
   - انسخ `backend-addons/.platform/hooks/postdeploy/30_seed_if_enabled.sh` إلى مجلد `.platform/hooks/postdeploy/` داخل مشروعك.
   - أضف متغير بيئة في EB: `SEED_ON_DEPLOY=true`
