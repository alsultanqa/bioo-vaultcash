import cors from 'cors';
const ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
export const corsMw = cors({
  origin: (origin, cb) => (!origin || ORIGINS.length===0 || ORIGINS.includes(origin)) ? cb(null, true) : cb(new Error('CORS blocked'), false),
  credentials: false
});
