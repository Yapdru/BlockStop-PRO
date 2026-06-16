# BlockStop PRO

**BlockStop PRO** is the premium tier of the BlockStop security platform, offering advanced email and file security with team collaboration, VPN integration, and 2-factor authentication.

## Features

### Plans Available
- **PRO** ($9.99/month)
  - Team Collaboration (up to 6 users)
  - 100+ VPN Providers
  - 2FA Authentication
  - WiFi Security Checker
  - Advanced Analytics
  - File Quarantine
  - Priority Support

- **PREMIUM** ($19.99/month)
  - All PRO Features
  - Desktop Apps (Windows, Mac, Linux)
  - Mobile Apps (iOS + Android)
  - Browser Extensions (Chrome, Firefox)
  - AI Threat Predictions
  - Unlimited Teams
  - Threat Intelligence API
  - 24/7 Premium Support

### Payment
- Stripe integration for secure payment processing
- 7-day free trial for all new subscriptions
- Monthly recurring billing
- Webhook support for subscription events

### Security
- 2-Factor Authentication (TOTP/Google Authenticator)
- Email verification during checkout
- Secure Stripe webhook handling

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Stripe account (for API keys)

### Installation

1. **Clone the repository** (if using as separate repo)
   ```bash
   git clone <repo-url>
   cd blockstop-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add:
   - `NEXT_PUBLIC_APP_URL`: Your app URL (e.g., http://localhost:3000)
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`: Your Stripe public key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- **`/plans`** - Plan comparison and selection
- **`/checkout`** - Multi-step checkout with email, 2FA, and payment
- **`/thank-you`** - Success confirmation and next steps

## API Endpoints

### Authentication
- `POST /api/auth/check-email` - Validate email address
- `POST /api/auth/2fa/generate-checkout` - Generate 2FA QR code for checkout

### Payment
- `POST /api/payment/create-checkout` - Create Stripe checkout session
- `GET /api/payment/session/[sessionId]` - Retrieve checkout session details
- `POST /api/payment/webhook` - Handle Stripe webhook events

## Stripe Setup

### Creating a Checkout Session
The `/api/payment/create-checkout` endpoint accepts:
```json
{
  "email": "user@example.com",
  "planId": "pro-monthly",
  "twoFactorSecret": "optional-2fa-secret"
}
```

Response:
```json
{
  "sessionId": "cs_live_..."
}
```

### Webhook Events
The webhook handler processes:
- `checkout.session.completed` - New subscription created
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.paid` - Payment successful
- `invoice.payment_failed` - Payment failed

## Environment Variables

```
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Database (Future Phase)

When database integration is added:
- Store subscription metadata
- Track team memberships
- Maintain audit logs
- Store VPN preferences

## Development

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Type Checking
TypeScript strict mode is enabled. All type errors must be resolved.

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Docker
```bash
docker build -t blockstop-pro .
docker run -p 3000:3000 blockstop-pro
```

## Related Repositories

- **BlockStop NEO**: Free tier (single user, no payment)
- **BlockStop Office**: Enterprise tier (SSO, admin console)

## Support

For issues and feature requests, please open an issue on GitHub.

## License

Proprietary - All rights reserved
