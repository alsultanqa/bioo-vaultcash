import { Router } from 'express';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '../db';
import { signJwt } from '../auth/jwt';
import { requireAuth } from '../auth/middleware';

const r = Router();

// DEV ONLY registration (disable in prod)
r.post('/auth/register', async (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email_password_required' });
  const hash = await bcrypt.hash(password, 12);
  const u = await prisma.user.create({ data: { email, password: hash, role: (role || 'DEVELOPER') } });
  res.json({ id: u.id, email: u.email, role: u.role });
});

r.post('/auth/login', async (req, res) => {
  const { email, password, token } = req.body || {};
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = await bcrypt.compare(password || '', u.password);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  // If MFA is set, require TOTP token
  if (u.mfaSecret){
    const passed = speakeasy.totp.verify({ secret: u.mfaSecret, encoding: 'base32', token });
    if (!passed) return res.status(401).json({ error: 'mfa_required_or_invalid' });
  }
  const jwt = signJwt({ sub: u.id, email: u.email, role: u.role });
  res.json({ token: jwt, role: u.role });
});

r.post('/auth/mfa/setup', requireAuth, async (req: any, res) => {
  const u = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!u) return res.status(404).json({ error: 'not_found' });
  const secret = speakeasy.generateSecret({ name: `QatarCash (${u.email})` });
  const otpauth = secret.otpauth_url || '';
  const qr = await QRCode.toDataURL(otpauth);
  // store secret temporarily (client must verify to enable)
  await prisma.user.update({ where: { id: u.id }, data: { mfaSecret: secret.base32 } });
  res.json({ otpauth, qrDataUrl: qr });
});

r.post('/auth/mfa/verify', requireAuth, async (req: any, res) => {
  const { token } = req.body || {};
  const u = await prisma.user.findUnique({ where: { id: req.user.sub } });
  if (!u?.mfaSecret) return res.status(400).json({ error: 'no_secret' });
  const passed = speakeasy.totp.verify({ secret: u.mfaSecret, encoding: 'base32', token });
  if (!passed) return res.status(400).json({ error: 'invalid_token' });
  res.json({ ok: true });
});

export default r;
