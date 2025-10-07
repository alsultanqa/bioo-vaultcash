import { Acquirer } from './types';
import axios from 'axios';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export class NapsAcquirer implements Acquirer {
  base = required('NAPS_BASE_URL');     // e.g., https://api.naps.qa/gateway
  key  = required('NAPS_API_KEY');
  sec  = required('NAPS_API_SECRET');

  client = axios.create({ baseURL: this.base, timeout: 45000 });

  async createPayment(payload: any){
    const r = await this.client.post('/v1/payments', payload, { headers: { Authorization: `Bearer ${this.key}` } });
    const d = r.data || {};
    return { paymentId: d.paymentId || d.id, checkoutUrl: d.checkoutUrl || d.redirectUrl };
  }
  async getPaymentStatus(paymentId: string){
    const r = await this.client.get(`/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${this.key}` } });
    const d = r.data || {};
    return { status: d.status, capturedAmount: d.capturedAmount, txnRef: d.txnRef || d.rrn };
  }
  async refundPayment(payload: { paymentId: string; amount: number }){
    const r = await this.client.post('/v1/refunds', payload, { headers: { Authorization: `Bearer ${this.key}` } });
    const d = r.data || {};
    return { refundId: d.refundId || d.id, status: d.status };
  }
}
