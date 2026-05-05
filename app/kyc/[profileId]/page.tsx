'use client';

import { useEffect } from 'react';
import LawyerKYC from '@/components/LawyerKYC';

export default function KYCPage({ params, searchParams }: {
  params: { profileId: string };
  searchParams: { token?: string };
}) {
  const { profileId } = params;
  const { token } = searchParams;

  // Set URL parameters so LawyerKYC component can read them
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (token) url.searchParams.set('token', token);
      url.searchParams.set('profileId', profileId);
      window.history.replaceState({}, '', url.toString());
    }
  }, [token, profileId]);

  return <LawyerKYC />;
}
