'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [email, setEmail] = useState('');
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    if (sessionId) {
      const fetchSessionDetails = async () => {
        try {
          const response = await fetch(`/api/payment/session/${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            setEmail(data.email);
            setPlanName(data.planName);
          }
        } catch (err) {
          console.error('Error fetching session:', err);
        }
      };

      fetchSessionDetails();
    }
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-center max-w-md"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>

        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Thank You!
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-green-600 mb-8"
        >
          Pls Pay to D :)
        </motion.p>

        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 mb-8 shadow-xl border-2 border-green-200"
        >
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Payment Successful!
          </p>

          <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4 mb-4">
            {planName && (
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">
                  Plan
                </p>
                <p className="text-gray-900 font-bold">{planName}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-600 font-semibold uppercase">
                Account Email
              </p>
              <p className="text-gray-900 font-bold">{email || 'Loading...'}</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-green-900 font-semibold">
              🎁 7-Day Free Trial Activated
            </p>
            <p className="text-sm text-green-700 mt-1">
              Subscription starts after 7 days. Cancel anytime.
            </p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block px-6 py-4 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition shadow-lg"
          >
            Go to Dashboard →
          </Link>

          <Link
            href="/settings"
            className="block px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            Configure Account
          </Link>
        </div>

        {/* Email Confirmation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-600 mt-8"
        >
          ✓ Confirmation email sent to <span className="font-semibold">{email || 'your email'}</span>
        </motion.p>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left"
        >
          <p className="font-semibold text-gray-900 mb-2">Next Steps:</p>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>✓ Check your email for account confirmation</li>
            <li>✓ Set up your team (invite up to 6 members)</li>
            <li>✓ Configure VPN preferences</li>
            <li>✓ Enable WiFi security monitoring</li>
          </ol>
        </motion.div>
      </motion.div>
    </main>
  );
}
