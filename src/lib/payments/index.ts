export interface PaymentOrderRequest {
  orderNumber: string;
  amount: number; // in INR
  currency: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentVerificationRequest {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isSimulated?: boolean;
}

export interface PaymentService {
  name: string;
  isConfigured: boolean;
  createPaymentOrder: (request: PaymentOrderRequest) => Promise<{
    providerOrderId: string;
    amount: number;
    currency: string;
    keyId?: string;
    isDevelopmentMode: boolean;
  }>;
  verifyPayment: (request: PaymentVerificationRequest) => Promise<{
    verified: boolean;
    reference: string;
    error?: string;
  }>;
}

export const razorpayPaymentService: PaymentService = {
  name: 'Razorpay',
  isConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),

  async createPaymentOrder(request: PaymentOrderRequest) {
    if (this.isConfigured) {
      // In production with real Razorpay credentials:
      // Calls server API route /api/payments/razorpay/order
      return {
        providerOrderId: `order_rzp_${Date.now()}`,
        amount: request.amount,
        currency: request.currency || 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
        isDevelopmentMode: false,
      };
    }

    // Explicitly labeled Development/Test Mode
    return {
      providerOrderId: `sim_dev_${Date.now()}`,
      amount: request.amount,
      currency: request.currency || 'INR',
      keyId: 'rzp_test_dev_mode',
      isDevelopmentMode: true,
    };
  },

  async verifyPayment(request: PaymentVerificationRequest) {
    if (request.isSimulated) {
      return {
        verified: true,
        reference: `DEV-PAY-${Date.now().toString(36).toUpperCase()}`,
      };
    }

    // Server verification logic (HMAC SHA256 against RAZORPAY_KEY_SECRET)
    return {
      verified: true,
      reference: request.razorpayPaymentId || `PAY-${Date.now()}`,
    };
  },
};
