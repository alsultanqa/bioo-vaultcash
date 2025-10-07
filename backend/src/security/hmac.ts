import crypto from 'crypto';
import { cfg } from '../config';

export function verifyHmac(raw: string, provided?: string): boolean {
  if (!provided) return false;
  const hmac = crypto.createHmac(cfg.sigAlg, cfg.apiSecret).update(raw).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(hmac, 'hex'));
}
