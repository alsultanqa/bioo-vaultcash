# Monitoring & Alerts

## Prometheus Operator
Apply ServiceMonitor and Rules:
```
kubectl apply -f infra/monitoring/servicemonitor.yaml
kubectl apply -f infra/monitoring/prometheus-rules.yaml
# Alertmanager config (if using operator-managed secret):
kubectl -n monitoring create secret generic alertmanager-main --from-file=alertmanager.yaml=infra/monitoring/alertmanager-config.yaml --dry-run=client -o yaml | kubectl apply -f -
```
Grafana: import JSON dashboards in `infra/monitoring/*.json`.

## Metrics Endpoint
- The backend exposes `/metrics` via `express-prom-bundle`.
- Ensure Service has a named port `http` mapped to container port.

# Ingress mTLS & Security
- Enable mTLS by setting in `infra/helm/adapter/values.yaml`:
```
ingress:
  mtls:
    enabled: true
    clientCaSecret: qc-client-ca
```
- Create the client CA secret:
```
kubectl -n <ns> create secret tls qc-client-ca --cert=client-ca.crt --key=client-ca.key
```
- For strict TLS, use cert-manager ClusterIssuer and reference `tlsSecret` in values.


## k6 Stress Tests
- Payments:
  `k6 run tests/k6/payments.js -e BASE=http://localhost:3001 -e VUS=50 -e DURATION=5m`
- Webhooks:
  `k6 run tests/k6/webhooks.js -e BASE=http://localhost:3001 -e SECRET=<QC_API_SECRET> -e VUS=20 -e DURATION=3m`

## Grafana Bootstrap (Teams & Permissions)
```
export GRAFANA_URL="https://grafana.example.com"
export GRAFANA_TOKEN="<api-token-with-admin>"
bash infra/monitoring/grafana/bootstrap.sh
```
- يمنح Team **Oncall** صلاحية Admin على مجلد "QatarCash"، و**FinOps** صلاحية Viewer.

