import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app'; // assuming app exports Express app

describe('BioVault Adapter', () => {
  it('rejects bad envelope', async () => {
    const res = await request(app).post('/api/biovault/relay').send({ v: 3, from:'0xA', to:'0xB' });
    expect(res.status).toBe(400);
  });

  it('accepts v3 envelope', async () => {
    const res = await request(app)
      .post('/api/biovault/relay')
      .send({ v: 3, from:'0x123', to:'0x456', nonce:'n1', iv:'AA==', ct:'AA==' });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('accepts claim proofs', async () => {
    const res = await request(app)
      .post('/api/biovault/claim-proofs')
      .send({
        proofs: [{ segmentIndex:1, currentBioConst: 1736565605, ownershipProof:'0x'+'0'*64, unlockIntegrityProof:'0x'+'0'*64, spentProof:'0x'+'0'*64, ownershipChangeCount:1, biometricZKP:'0x'+'0'*64 }],
        signature: '0x'+'0'*130,
        deviceKeyHash: '0x'+'0'*64,
        userBioConstant: 1736565605,
        nonce: 1
      });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
