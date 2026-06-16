import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { email, planId, twoFactorSecret } = session.metadata || {};

      if (email && planId) {
        // In a real app, save to database:
        // await db.query(
        //   `INSERT INTO pro_subscriptions (email, plan_id, stripe_customer_id, stripe_subscription_id, trial_ends_at)
        //    VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')`,
        //   [email, planId, session.customer, session.subscription]
        // );

        console.log(`✓ Subscription created for ${email} on plan ${planId}`);
        console.log(`  Stripe Customer: ${session.customer}`);
        console.log(`  Stripe Subscription: ${session.subscription}`);

        // Send confirmation email (implement with SendGrid, AWS SES, etc)
        // await sendConfirmationEmail(email, planId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`✓ Subscription updated: ${subscription.id}`);
      // Handle subscription updates (plan changes, etc)
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`✓ Subscription cancelled: ${subscription.id}`);
      // Handle subscription cancellation
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`✓ Invoice paid: ${invoice.id}`);
      // Handle successful payment
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`✗ Payment failed for invoice: ${invoice.id}`);
      // Handle failed payment
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
