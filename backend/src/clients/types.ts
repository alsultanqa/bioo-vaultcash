export interface Acquirer {
  createPayment(payload: any): Promise<{ paymentId: string; checkoutUrl: string }>;
  getPaymentStatus(paymentId: string): Promise<{ status: string; capturedAmount?: number; txnRef?: string }>;
  refundPayment(payload: { paymentId: string; amount: number }): Promise<{ refundId: string; status: string }>;
}
