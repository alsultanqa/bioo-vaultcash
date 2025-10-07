import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
export type JwtUser = { id: string; email: string; role: 'OWNER'|'ADMIN'|'FINANCE'|'DEVELOPER' };

export function signJwt(user: JwtUser){
  return jwt.sign(user, SECRET, { expiresIn: '2h' });
}

export function requireAuth(req: Request, res: Response, next: NextFunction){
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
  if(!token) return res.status(401).json({ error: 'unauthorized' });
  try{
    (req as any).user = jwt.verify(token, SECRET) as JwtUser;
    next();
  }catch{
    return res.status(401).json({ error: 'unauthorized' });
  }
}

export function requireRole(...roles: JwtUser['role'][]){
  return (req: Request, res: Response, next: NextFunction) => {
    const u = (req as any).user as JwtUser | undefined;
    if(!u) return res.status(401).json({ error: 'unauthorized' });
    if(!roles.includes(u.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

export function hasRole(u: JwtUser|undefined, ...roles: JwtUser['role'][]){
  return !!u && roles.includes(u.role);
}
