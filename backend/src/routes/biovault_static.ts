import path from 'path';
import express from 'express';
import { Router } from 'express';

const r = Router();
const staticRoot = path.resolve(process.cwd(), 'apps', 'biovault');

// Serve the PWA exactly as provided (no transforms)
r.use('/', express.static(staticRoot, { fallthrough: true, index: false, etag: true, maxAge: '7d' }));

// HTML5 history for /biovault routes
r.get(['/', '/index.html', '/dashboard', '/scl', '/biovault'], (_req, res) => {
  res.sendFile(path.join(staticRoot, 'index.html'));
});

export default r;
