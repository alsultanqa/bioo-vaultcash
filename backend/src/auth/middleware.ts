import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from './jwt';

export function requireAuth(req: Request, res: Response, next: NextFunction){
  const h = req.headers.authorization || '';
  const tok = h.startsWith('Bearer ') ? h.slice(7) : '';
  const p = tok ? verifyJwt(tok) : null;
  if (!p) return res.status(401).json({ error: 'unauthorized' });
  (req as any).user = p;
  next();
}

export function requireRole(...roles: string[]){
  return (req: Request, res: Response, next: NextFunction) => {
    const u = (req as any).user;
    if (!u || !roles.includes(u.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}
