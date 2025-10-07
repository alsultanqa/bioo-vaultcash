# WAF Playbook (NGINX Ingress + ModSecurity/OWASP CRS)

## Strategy
- **API traffic**: Strict CRS enabled by default.
- **Webhook endpoint**: Relax CRS for false-positive rules (e.g., 941100, 942100, 913100) and apply **IP allowlist** of the provider.
- Use **mTLS** for admin APIs if possible; JWT + RBAC at app layer.

## Tuning Steps
1. Start in `DetectionOnly` in staging:
```
nginx.ingress.kubernetes.io/modsecurity-snippet: |
  SecRuleEngine DetectionOnly
  Include /etc/nginx/owasp-modsecurity-crs/nginx-modsecurity.conf
```
2. Review audit logs, then switch to `On` and **remove specific rule IDs** where safe.
3. For path-specific relaxations, deploy **separate Ingress** per path with different annotations (as in our templates).
4. Keep **server-snippet** headers hardened and ensure **HSTS** is active.

## Example allowlist for webhooks
values.yaml:
```
ingress:
  webhooks:
    ipAllowlist: "203.0.113.0/24,198.51.100.10/32"
```
