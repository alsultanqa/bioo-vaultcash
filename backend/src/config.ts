import 'dotenv/config';

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export const cfg = {
  port: Number(process.env.PORT || 3001),
  env: process.env.NODE_ENV || 'development',

  // Placeholder external acquirer/gateway (we will adapt later)
  baseUrl: process.env.QC_BASE_URL || 'https://api.example',

  apiKey: must('QC_API_KEY'),
  apiSecret: must('QC_API_SECRET'),

  sigHeader: process.env.QC_HEADERS_SIGNATURE_NAME || 'x-qc-signature',
  sigAlg: process.env.QC_SIGNATURE_ALG || 'sha256',

  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  idemTtl: Number(process.env.IDEMPOTENCY_TTL_SECONDS || 86400),

  corsOrigin: (process.env.DASH_PUBLIC_ORIGIN || '').split(',').filter(Boolean)
};
