import crypto from 'crypto';

export function verifyHmac(secret: string, raw: Buffer, signatureHex: string|undefined){
  if(!signatureHex) return false;
  const mac = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(signatureHex));
}
