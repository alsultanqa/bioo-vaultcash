# NGINX Ingress WAF (ModSecurity + OWASP CRS)

## Enable WAF
Set the following annotations on the Ingress (requires NGINX Ingress with ModSecurity compiled/enabled):

```
nginx.ingress.kubernetes.io/modsecurity: "on"
nginx.ingress.kubernetes.io/modsecurity-snippet: |
  SecRuleEngine On
  Include /etc/nginx/owasp-modsecurity-crs/nginx-modsecurity.conf
  SecAuditEngine RelevantOnly
  SecAuditLogParts ABIJDEFHZ
  SecAuditLog /var/log/modsec_audit.log
  SecRequestBodyAccess On
  SecResponseBodyAccess Off
```

### Tuning
- Add allowlists for webhook source IPs to reduce false positives.
- Disable rules per-location if needed:
```
nginx.ingress.kubernetes.io/server-snippet: |
  location /webhooks/qatarcash {
    ModSecurityRuleRemoveById 942100 941100;
  }
```
