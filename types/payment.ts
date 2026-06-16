export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface CheckoutSession {
  sessionId: string;
  email: string;
  planId: string;
  status: 'open' | 'complete' | 'expired';
  amountTotal?: number;
  currency?: string;
}

export interface SubscriptionEvent {
  id: string;
  type: 'checkout.session.completed' | 'customer.subscription.updated' | 'customer.subscription.deleted' | 'invoice.paid' | 'invoice.payment_failed';
  email?: string;
  planId?: string;
  customerId?: string;
  subscriptionId?: string;
  timestamp: Date;
}
