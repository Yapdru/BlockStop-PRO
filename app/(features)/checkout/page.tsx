import { Suspense } from 'react';
import { CheckoutContent } from './checkout-content';

function CheckoutFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-light-bg to-primary-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
