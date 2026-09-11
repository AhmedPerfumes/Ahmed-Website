import ReviewOrderLanding from '@/components/otherPages/ReviewOrderLanding';
import React, { Suspense } from 'react';

export const metadata = {
  title: 'Review Your Order | Ahmed Al Maghribi Perfumes',
  description: 'Share your valued experience and fragrance review with Ahmed Al Maghribi Perfumes.',
};

export default function ReviewOrderPage() {
  return (
    <Suspense fallback={<div className="py-5 text-center">Loading review experience...</div>}>
      <ReviewOrderLanding />
    </Suspense>
  );
}
