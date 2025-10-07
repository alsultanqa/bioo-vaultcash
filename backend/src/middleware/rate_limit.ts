import { Request, Response, NextFunction } from 'express';
const BUCKET = new Map<string, { count: number; resetAt: number }>(); const LIMIT = Number(process.env.RATE_LIMIT || 60); const WINDOW_MS = 60_000;
export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || 'anon'; const now = Date.now(); const b = BUCKET.get(key) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > b.resetAt) { b.count = 0; b.resetAt = now + WINDOW_MS; } b.count += 1; BUCKET.set(key, b);
  res.setHeader('X-RateLimit-Limit', String(LIMIT)); res.setHeader('X-RateLimit-Remaining', String(Math.max(0, LIMIT - b.count))); res.setHeader('X-RateLimit-Reset', String(Math.ceil(b.resetAt / 1000)));
  if (b.count > LIMIT) return res.status(429).json({ error: 'rate_limited' }); next();
}
