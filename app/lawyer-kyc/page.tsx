import { Suspense } from 'react';
import LawyerKYC from '@/components/LawyerKYC';

export default function LawyerKYCPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LawyerKYC />
    </Suspense>
  );
}