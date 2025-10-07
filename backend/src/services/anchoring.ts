import crypto from 'crypto';
import { BalansClient } from '../integrations/balans';
import { prisma } from '../db';
import { logger } from '../logger';

/**
 * Collect successful charges periodically, compute Merkle root, anchor to Balans Chain.
 * This service writes anchor metadata to DB without touching Balans codebase.
 */
export async function runAnchoringOnce(){
  // gather latest successful payment links (as a proxy for charges)
  const items = await prisma.paymentLink.findMany({ where: { status: { in: ['captured', 'paid', 'succeeded'] } }, take: 500, orderBy: { createdAt: 'desc' } });
  if (!items.length) return { skipped: true };

  const leaves = items.map(x => crypto.createHash('sha256').update(`${x.paymentId}:${x.amount}:${x.currency}`).digest('hex'));
  // merkle (simple pairwise)
  function merkle(le: string[]): string {
    if (le.length === 1) return le[0];
    const next: string[] = [];
    for (let i=0;i<le.length;i+=2){
      const a = le[i], b = le[i+1] || le[i];
      next.push(crypto.createHash('sha256').update(a+b).digest('hex'));
    }
    return merkle(next);
  }
  const root = merkle(leaves);
  const batchId = 'batch_' + Date.now();
  const balans = new BalansClient();
  const res = await balans.anchor({ merkleRoot: root, batchId, metadata: { count: items.length } });
  logger.info({ res, root, batchId }, 'anchored-to-balans');

  // persist anchor row
  await prisma.ledgerEntry.create({ data: { id: res.anchorId || batchId, seq: Math.floor(Math.random()*1e9), ts: new Date(), ref: batchId, type: 'anchor', postings: { root, txHash: res.txHash, chain: res.chain, count: items.length } as any } });
  return { ok: true, root, batchId, anchor: res };
}
