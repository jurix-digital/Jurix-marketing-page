import LawyerKYC from '@/components/LawyerKYC';

export default function KYCPage({ params, searchParams }: {
  params: { profileId: string };
  searchParams: { token?: string };
}) {
  const { profileId } = params;
  const { token } = searchParams;

  // Render LawyerKYC directly with token and profileId
  return <LawyerKYC initialToken={token} initialProfileId={profileId} />;
}
