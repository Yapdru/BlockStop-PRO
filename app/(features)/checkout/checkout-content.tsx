'use client';

import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

type CheckoutStep = 'email' | '2fa' | 'payment';

interface CheckoutState {
  email: string;
  planId: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  qrCode?: string;
}

export function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams?.get('plan') || '';

  const [state, setState] = useState<CheckoutState>({
    email: '',
    planId,
    twoFactorEnabled: false
  });

  const [step, setStep] = useState<CheckoutStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Email check failed');
        return;
      }

      setStep('2fa');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (state.twoFactorEnabled) {
        const response = await fetch('/api/auth/2fa/generate-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: state.email })
        });

        if (!response.ok) {
          setError('2FA setup failed');
          return;
        }

        const { secret, qrCode } = await response.json();
        setState(prev => ({ ...prev, twoFactorSecret: secret, qrCode }));
      }

      setStep('payment');
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-light-bg to-primary-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {['email', '2fa', 'payment'].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition ${
                ['email', '2fa', 'payment'].indexOf(s) <= ['email', '2fa', 'payment'].indexOf(step)
                  ? 'bg-primary-600'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {step === 'email' && 'Enter Your Email'}
          {step === '2fa' && 'Setup Security'}
          {step === 'payment' && 'Complete Payment'}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step: Email */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-light-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step: 2FA */}
        {step === '2fa' && (
          <form onSubmit={handleTwoFactorContinue} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={state.twoFactorEnabled}
                  onChange={(e) =>
                    setState(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))
                  }
                  className="w-5 h-5 text-primary-600"
                />
                <span className="text-gray-900 font-semibold">
                  Enable 2-Factor Authentication
                </span>
              </label>
              <p className="text-xs text-gray-600 mt-2 ml-8">
                Recommended for account security
              </p>
            </div>

            {state.twoFactorEnabled && state.qrCode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-gray-50 rounded-lg text-center"
              >
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Scan with Authenticator App
                </p>
                <img
                  src={state.qrCode}
                  alt="2FA QR Code"
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-xs text-gray-600 mt-3">
                  Use Google Authenticator, Authy, or Microsoft Authenticator
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <StripeCheckoutForm
            email={state.email}
            planId={state.planId}
            twoFactorSecret={state.twoFactorSecret}
          />
        )}

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secured by Stripe • 7-day free trial • Cancel anytime
        </p>
      </motion.div>
    </main>
  );
}

function StripeCheckoutForm({ email, planId, twoFactorSecret }: {
  email: string;
  planId: string;
  twoFactorSecret?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!stripe || !elements) {
      setError('Stripe not loaded');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          planId,
          twoFactorSecret
        })
      });

      if (!response.ok) {
        setError('Payment setup failed');
        return;
      }

      const { sessionId } = await response.json();

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId
      });

      if (redirectError) {
        setError(redirectError.message || 'Checkout failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="p-4 border border-gray-300 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Complete Payment'}
      </button>
    </form>
  );
}
