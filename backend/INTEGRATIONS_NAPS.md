# NAPS Adapter Notes (Placeholder)

- This adapter expects NAPS Gateway endpoints similar to:
  - `POST /v1/payments` → { paymentId, redirectUrl/checkoutUrl }
  - `GET  /v1/payments/{id}` → { status, capturedAmount, rrn/txnRef }
  - `POST /v1/refunds` → { refundId, status }

- Map EMV/NAPS-specific TLVs into `MERCHANT_TLV` (env) for on-us routing if required.

- Add 3DS flow depending on acquirer specs:
  - Either redirect to ACS directly
  - Or use server-to-server challenge + front fallback

- Security: use allowlisted IPs, mTLS if required, and sign requests per acquirer guidance.
