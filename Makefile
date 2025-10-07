.PHONY: dev up seed migrate test build-prod k8s-apply k8s-secrets tf-init tf-apply

dev: ; docker compose up --build
up: ; docker compose up -d --build
seed: ; cd backend && npm run seed
migrate: ; cd backend && npx prisma migrate deploy
test: ; cd backend && npm test --silent
build-prod:
	docker build -t qc-backend:latest -f backend/Dockerfile.prod backend
	docker build -t qc-dashboard:latest -f dashboard/Dockerfile.prod dashboard
k8s-secrets:
	kubectl create secret generic qc-secrets 	  --from-literal=JWT_SECRET=$${JWT_SECRET:-change_me} 	  --from-literal=WEBHOOK_SECRET=$${WEBHOOK_SECRET:-change_me} 	  --dry-run=client -o yaml | kubectl apply -f -
k8s-apply:
	kubectl apply -f infra/k8s/postgres.yaml
	kubectl apply -f infra/k8s/backend.yaml
	kubectl apply -f infra/k8s/dashboard.yaml
	kubectl apply -f infra/k8s/ingress.yaml
tf-init: ; cd infra/terraform && terraform init
tf-apply: ; cd infra/terraform && terraform apply -auto-approve
