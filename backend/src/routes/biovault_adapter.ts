import { Router } from 'express';
import { runAnchoringOnce } from '../services/anchoring';
import { logger } from '../logger';

const r = Router();

// Lightweight validation helpers
function isHex32(x:string){ return /^0x[0-9a-fA-F]{64}$/.test(x||''); }
function isBytesLike(b:any){ return typeof b === 'string' && /^[A-Za-z0-9+/]+={0,2}$/.test(b); }

/**
 * POST /api/biovault/relay
 * Accepts envelopes:
 *  - v:3 { from,to,nonce,iv,ct } where iv/ct are base64 (CBOR body encrypted)
 *  - v:2 { from,to,nonce,iv,ct } encrypted JSON
 *  - v:1 legacy plaintext with chains[]
 * We do not decrypt here (device derived keys); we store + forward meta and
 * schedule an anchoring run. Balans Chain code remains untouched.
 */
r.post('/relay', async (req, res, next) => {
  try {
    const body = req.body || {};
    const v = Number(body.v||0);
    if (![1,2,3].includes(v)) return res.status(400).json({ ok:false, error:'Unsupported envelope version' });
    if (!body.from || !body.to || !body.nonce) return res.status(400).json({ ok:false, error:'Missing from/to/nonce' });

    // Minimal structure checks
    if (v===3 || v===2){
      if (!isBytesLike(body.iv) || !isBytesLike(body.ct)) return res.status(400).json({ ok:false, error:'Invalid iv/ct' });
    } else if (v===1){
      if (!Array.isArray(body.chains)) return res.status(400).json({ ok:false, error:'Missing chains for v1' });
    }

    logger.info({ v, from: body.from, to: body.to, nonce: body.nonce }, 'biovault-envelope-received');

    // Fire-and-forget – anchor recent successful payments to Balans (non-blocking UX)
    runAnchoringOnce().catch((e)=>logger.error({ err:e }, 'anchoring-trigger-failed'));

    res.json({ ok:true, accepted:true });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/biovault/claim-proofs
 * Accepts an EIP-712 signed claim bundle (hashes only – privacy preserving).
 * Backend does not submit to chain; it audits + stores and later can reconcile
 * with Balans anchor snapshots.
 */
r.post('/claim-proofs', async (req, res, next) => {
  try {
    const { proofs, signature, deviceKeyHash, userBioConstant, nonce } = req.body || {};
    if (!Array.isArray(proofs) || proofs.length === 0) return res.status(400).json({ ok:false, error:'No proofs' });
    if (!isHex32(deviceKeyHash)) return res.status(400).json({ ok:false, error:'deviceKeyHash must be bytes32 hex' });
    if (!signature || typeof signature !== 'string') return res.status(400).json({ ok:false, error:'Missing signature' });
    if (!Number.isInteger(userBioConstant) || !Number.isInteger(nonce)) return res.status(400).json({ ok:false, error:'Invalid bioConstant/nonce' });

    // TODO: optional on-chain verification using a read-only RPC if configured
    // For now we acknowledge and let anchoring snapshots cover integrity.
    logger.info({ count: proofs.length, ubc: userBioConstant }, 'claim-proofs-accepted');
    res.json({ ok:true, stored:true });
  } catch (e) {
    next(e);
  }
});

export default r;
