import LawyerKYC from '@/components/LawyerKYC';

export default async function KYCPage({ params, searchParams }: {
  params: Promise<{ profileId: string }>;
  searchParams: Promise<{ token?: string; mode?: string }>;
}) {
  const { profileId } = await params;
  const { token, mode } = await searchParams;

  console.log('KYCPage - profileId:', profileId, 'token:', token);

  // Render LawyerKYC directly with token and profileId
  return <LawyerKYC initialToken={token} initialProfileId={profileId} initialMode={mode} />;
}
