import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const r = Router();
const p = path.resolve(process.cwd(), 'openapi.json');
r.use('/', swaggerUi.serve);
r.get('/', (_req, res) => {
  const doc = JSON.parse(fs.readFileSync(p, 'utf8'));
  return swaggerUi.setup(doc)(_req, res);
});
r.get('/openapi.json', (_req, res) => res.sendFile(p));
export default r;
