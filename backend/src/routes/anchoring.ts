import { Router } from 'express';
import { requireAuth, requireRole } from '../auth/middleware';
import { runAnchoringOnce } from '../services/anchoring';

const r = Router();
r.post('/admin/anchor/run', requireAuth, requireRole('OWNER','ADMIN'), async (_req, res, next) => {
  try { res.json(await runAnchoringOnce()); } catch (e){ next(e); }
});
export default r;
