import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const planPrices: Record<string, { name: string; amount: number }> = {
  'pro-monthly': { name: 'PRO', amount: 999 },
  'premium-monthly': { name: 'PREMIUM', amount: 1999 }
};

export async function POST(request: NextRequest) {
  try {
    const { email, planId, twoFactorSecret } = await request.json();

    if (!email || !planId || !planPrices[planId]) {
      return NextResponse.json(
        { error: 'Invalid plan or email' },
        { status: 400 }
      );
    }

    const planInfo = planPrices[planId];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `BlockStop ${planInfo.name}`,
              description: `Monthly subscription for ${planInfo.name} tier`
            },
            unit_amount: planInfo.amount,
            recurring: {
              interval: 'month',
              interval_count: 1
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?plan=${planId}`,
      metadata: {
        email,
        planId,
        planName: planInfo.name,
        twoFactorSecret: twoFactorSecret || ''
      },
      billing_address_collection: 'required',
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          email,
          planId
        }
      }
    });

    return NextResponse.json({
      sessionId: session.id
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
