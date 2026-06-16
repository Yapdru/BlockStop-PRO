'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    id: 'pro-monthly',
    name: 'PRO',
    price: 9.99,
    description: 'Perfect for professionals',
    features: [
      'Team Collaboration (6 users)',
      '100+ VPN Providers',
      '2FA Authentication',
      'WiFi Security Checker',
      'Advanced Analytics',
      'File Quarantine',
      'Priority Support'
    ]
  },
  {
    id: 'premium-monthly',
    name: 'PREMIUM',
    price: 19.99,
    description: 'Maximum security & features',
    features: [
      'All PRO Features',
      'Desktop App (Windows, Mac, Linux)',
      'Mobile Apps (iOS + Android)',
      'Browser Extensions (Chrome, Firefox)',
      'AI Threat Predictions',
      'Unlimited Teams',
      'Threat Intelligence API',
      '24/7 Premium Support'
    ],
    highlighted: true
  }
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-light-bg via-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white border-b border-light-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            BlockStop PRO
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock advanced security features for your team
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-2xl shadow-xl p-8 transition ${
                plan.highlighted
                  ? 'border-2 border-primary-600 bg-gradient-to-br from-white to-primary-50 transform scale-105'
                  : 'border border-gray-200 bg-white hover:shadow-2xl'
              }`}
            >
              {plan.highlighted && (
                <div className="mb-4 inline-block px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h2>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              <a
                href={`/checkout?plan=${plan.id}`}
                className={`w-full block text-center px-6 py-3 rounded-lg font-semibold mb-8 transition ${
                  plan.highlighted
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                }`}
              >
                Get Started
              </a>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! You can cancel your subscription anytime. No questions asked.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Get 7 days free with any plan. Full access, no credit card required after trial.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards through Stripe. Invoicing available for enterprise.'
              },
              {
                q: 'Can I change plans?',
                a: 'Absolutely! Upgrade or downgrade your plan anytime with prorated billing.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
