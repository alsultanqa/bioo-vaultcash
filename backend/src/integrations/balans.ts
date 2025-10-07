/**
 * Balans Chain Integration Adapter (non-invasive)
 * - We do NOT modify Balans Chain code; we call its public HTTP APIs or CLI.
 * - Configure endpoints & API keys via env.
 */
import axios from 'axios';

export type BalansAnchorRequest = {
  merkleRoot: string;       // hex
  batchId: string;          // internal batch reference
  metadata?: Record<string, any>;
};

export class BalansClient {
  base = process.env.BALANS_BASE_URL || 'http://localhost:8080';
  key  = process.env.BALANS_API_KEY || '';

  client = axios.create({ baseURL: this.base, timeout: 30000 });

  async health(){ 
    const r = await this.client.get('/health'); 
    return r.data; 
  }

  async anchor(req: BalansAnchorRequest){
    const r = await this.client.post('/api/anchor', req, { headers: { 'Authorization': this.key ? `Bearer ${this.key}` : undefined } });
    return r.data; // expected: { anchorId, txHash, chain, timestamp }
  }

  async proof(anchorId: string){
    const r = await this.client.get(`/api/anchor/${anchorId}/proof`, { headers: { 'Authorization': this.key ? `Bearer ${this.key}` : undefined } });
    return r.data; // expected: { proof, root, leaf, verification }
  }
}
