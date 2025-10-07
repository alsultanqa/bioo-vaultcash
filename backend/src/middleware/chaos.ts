import { Request, Response, NextFunction } from 'express';

export function chaosMiddleware(req: Request, res: Response, next: NextFunction){
  // Enabled via CHAOS_ENABLED=1 and headers to target a scenario
  if (process.env.CHAOS_ENABLED !== '1') return next();
  const mode = req.header('x-chaos') || process.env.CHAOS_MODE;
  if (mode === 'latency'){
    const ms = Number(req.header('x-chaos-latency') || process.env.CHAOS_LATENCY || 300);
    return setTimeout(next, ms);
  }
  if (mode === 'error'){
    const code = Number(req.header('x-chaos-code') || process.env.CHAOS_CODE || 500);
    return res.status(code).json({ error: 'chaos_injected' });
  }
  next();
}
