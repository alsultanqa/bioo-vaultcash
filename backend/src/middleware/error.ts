import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction){
  logger.error({ err }, 'unhandled');
  const code = err.response?.status || err.status || 500;
  res.status(code).json({ error: err.message || 'internal_error', details: err.response?.data });
}
