import { Acquirer } from './types';

function sleep(ms: number){ return new Promise(r => setTimeout(r, ms)); }

export class MockAcquirer implements Acquirer {
  async createPayment(payload: any){
    await sleep(50);
    const id = 'pay_' + Math.random().toString(36).slice(2,9);
    const checkoutUrl = (process.env.PUBLIC_BASE_URL || 'http://localhost:3001') + '/checkout/' + 'tok_' + Math.random().toString(36).slice(2,8);
    return { paymentId: id, checkoutUrl };
  }
  async getPaymentStatus(paymentId: string){
    await sleep(50);
    return { status: 'captured', capturedAmount: 1500, txnRef: 'TXN-' + paymentId.slice(-4) };
  }
  async refundPayment(payload: { paymentId: string; amount: number }){
    await sleep(50);
    return { refundId: 'rf_' + Math.random().toString(36).slice(2,9), status: 'succeeded' };
  }
}

export function getAcquirer(): Acquirer {
  // Plug real adapter selection here (env flag): 'mock' | 'naps' | 'acquirerX'
    if ((process.env.QC_ACQUIRER || 'mock') === 'naps') { const { NapsAcquirer } = require('./naps'); return new NapsAcquirer(); }
  return new MockAcquirer();
}
