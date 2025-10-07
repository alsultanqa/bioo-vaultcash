import { Request, Response, NextFunction } from 'express';
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = Number(err?.status || err?.statusCode || 500);
  const msg = err?.message || 'internal_error';
  if (status >= 500) console.error(err);
  res.status(status).json({ error: msg });
}
