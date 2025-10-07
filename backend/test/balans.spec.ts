import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { BalansClient } from '../src/integrations/balans';

vi.mock('axios');
const mocked = axios as any;

describe('BalansClient', () => {
  it('anchors a root', async () => {
    mocked.create = vi.fn(() => ({ post: vi.fn(() => ({ data: { anchorId: 'anc_1', txHash: '0xabc' } })) }));
    const c = new BalansClient();
    const res = await c.anchor({ merkleRoot: 'deadbeef', batchId: 'b1' });
    expect(res.anchorId).toBe('anc_1');
  });
});
