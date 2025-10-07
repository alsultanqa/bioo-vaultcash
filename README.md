# QatarCash — Enterprise All‑in‑One

جاهز للتشغيل محليًا، عبر Docker، والنشر على GitHub (Pages + GHCR)، ومع قوالب K8s وTerraform.
يشمل **بيانات Seed أساسية** + **بيانات تجريبية موسّعة** (تجار، مفاتيح، وروابط دفع متعددة).

## تشغيل سريع (Docker)
```bash
docker compose up --build
# Dashboard: http://localhost:3000/login
# Backend:   http://localhost:3001/health
# Login: owner@qatarchash.local / ChangeMe123!
```
> بعد التشغيل: افتح لوحة الأدمن وأنشئ/استعرض الروابط أو مفاتيح الـAPI.

## GitHub
- Pages: `.github/workflows/pages.yml`
- Backend CI: `.github/workflows/backend-ci.yml`
- GHCR push: `.github/workflows/backend-ghcr.yml`
- Migrate (manual): `.github/workflows/migrate.yml`

### Secrets
- `QC_API_BASE`، `DATABASE_URL`، (اختياري) `JWT_SECRET`, `WEBHOOK_SECRET`

## نشر K8s
```bash
kubectl create secret generic qc-secrets   --from-literal=JWT_SECRET='change_me'   --from-literal=WEBHOOK_SECRET='change_me'

kubectl apply -f infra/k8s/postgres.yaml
kubectl apply -f infra/k8s/backend.yaml
kubectl apply -f infra/k8s/dashboard.yaml
kubectl apply -f infra/k8s/ingress.yaml
```

## Terraform (واجهة ساكنة)
```bash
cd infra/terraform
terraform init
terraform apply
```
