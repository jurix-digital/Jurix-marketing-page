'use client';

import { useEffect } from 'react';

export default function KYCPage({ params, searchParams }: {
  params: { profileId: string };
  searchParams: { token?: string };
}) {
  const { profileId } = params;
  const { token } = searchParams;

  // Redirect to lawyer-kyc page with token and profileId in query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const redirectUrl = token 
        ? `/lawyer-kyc?token=${token}&profileId=${profileId}`
        : `/lawyer-kyc?profileId=${profileId}`;
      window.location.href = redirectUrl;
    }
  }, [token, profileId]);

  return null;
}
