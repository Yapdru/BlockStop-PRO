import { Suspense } from 'react';
import { ThankYouContent } from './thank-you-content';

function ThankYouFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🎉</div>
        <p className="text-gray-600">Loading thank you page...</p>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}
