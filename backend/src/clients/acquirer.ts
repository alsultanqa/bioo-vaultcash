import { getAcquirer } from './mock';
// using adapter pattern

export async function createPayment(payload: any){
  return await getAcquirer().createPayment(payload);
}

export async function _createPayment_http_only(payload: any){
  // Placeholder: route to acquirer/payment switch
  const res = await http.post('/v1/payments', payload);
  return res.data; // { paymentId, checkoutUrl }
}

export async function getPaymentStatus(paymentId: string){
  return await getAcquirer().getPaymentStatus(paymentId);
}

export async function _getPaymentStatus_http_only(paymentId: string){
  const res = await http.get(`/v1/payments/${paymentId}`);
  return res.data; // { status, capturedAmount, txnRef }
}

export async function refundPayment(payload: any){
  return await getAcquirer().refundPayment(payload);
}

export async function _refundPayment_http_only(payload: any){
  const res = await http.post('/v1/refunds', payload);
  return res.data; // { refundId, status }
}
