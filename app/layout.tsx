import type { Metadata } from 'next';
import { StripeProvider } from '@/components/stripe-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'BlockStop PRO - Premium Security Platform',
  description: 'Advanced email and file security with team collaboration, VPN integration, and 2FA protection.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StripeProvider>
          {children}
        </StripeProvider>
      </body>
    </html>
  );
}
