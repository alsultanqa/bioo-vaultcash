# Frontend (Static) for S3/CloudFront

## النشر
1) فعّل **Static website hosting** للبكت (Index & Error = `index.html`).
2) ارفع الملفات:
   ```bash
   aws s3 sync ./frontend-s3 s3://<YOUR_BUCKET_NAME>/ --delete
   ```
3) (اختياري) CloudFront: اربط الـDistribution بالبكت ثم فعّل HTTPS، وبعد كل نشر:
   ```bash
   aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
   ```

بعد الفتح، ضع رابط API الخاص ببيئة EB واحفظه في الحقل أعلى الصفحة.
